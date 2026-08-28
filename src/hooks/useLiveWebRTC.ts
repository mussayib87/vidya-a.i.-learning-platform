import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

type LiveRole = "teacher" | "student";
type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected";
type SignalPayload = {
  from?: string;
  to?: string;
  peerId?: string;
  role?: LiveRole;
  description?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

type UseLiveWebRTCOptions = {
  classId: string;
  role: LiveRole;
  active?: boolean;
};

const rtcConfiguration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function sendSignal(channel: ReturnType<typeof supabase.channel>, event: string, payload: SignalPayload) {
  void channel.send({ type: "broadcast", event, payload });
}

export function useLiveWebRTC({ classId, role, active = true }: UseLiveWebRTCOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [classEnded, setClassEnded] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef(new Map<string, RTCPeerConnection>());
  const pendingCandidatesRef = useRef(new Map<string, RTCIceCandidateInit[]>());
  const peerIdRef = useRef(crypto.randomUUID());
  const mountedRef = useRef(false);
  const joinTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const closePeer = useCallback((peerId: string) => {
    peerConnectionsRef.current.get(peerId)?.close();
    peerConnectionsRef.current.delete(peerId);
    pendingCandidatesRef.current.delete(peerId);
  }, []);

  const addPendingCandidates = useCallback(async (peerId: string, connection: RTCPeerConnection) => {
    const candidates = pendingCandidatesRef.current.get(peerId) ?? [];
    pendingCandidatesRef.current.delete(peerId);
    for (const candidate of candidates) await connection.addIceCandidate(candidate);
  }, []);

  const addLocalTracks = useCallback((connection: RTCPeerConnection) => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const existingKinds = new Set(connection.getSenders().map((sender) => sender.track?.kind));
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    
    if (import.meta.env.DEV) {
      console.log("[WebRTC-Debug] Teacher stream tracks:", {
        videoTracks: videoTracks.length,
        audioTracks: audioTracks.length,
        videoEnabled: videoTracks[0]?.enabled,
        audioEnabled: audioTracks[0]?.enabled,
      });
    }
    
    stream.getTracks().forEach((track) => {
      if (!existingKinds.has(track.kind)) {
        connection.addTrack(track, stream);
        if (import.meta.env.DEV) {
          console.log("[WebRTC-Debug] Added track to peer connection:", {
            kind: track.kind,
            enabled: track.enabled,
          });
        }
      }
    });
  }, []);

  const createTeacherOffer = useCallback(async (studentId: string) => {
    const channel = channelRef.current;
    if (!channel || !mountedRef.current) return;
    let connection = peerConnectionsRef.current.get(studentId);
    if (!connection) {
      connection = new RTCPeerConnection(rtcConfiguration);
      peerConnectionsRef.current.set(studentId, connection);
      addLocalTracks(connection);
      connection.onicecandidate = (event) => {
        if (event.candidate) sendSignal(channel, "ice-candidate", { to: studentId, from: peerIdRef.current, candidate: event.candidate.toJSON() });
      };
      connection.onconnectionstatechange = () => {
        if (connection?.connectionState === "connected") setStatus("connected");
        if (connection?.connectionState === "disconnected") setStatus("reconnecting");
        if (connection?.connectionState === "failed") setStatus("reconnecting");
      };
    }
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    sendSignal(channel, "offer", { to: studentId, from: peerIdRef.current, description: offer });
  }, [addLocalTracks]);

  const startLocalMedia = useCallback(async () => {
    if (role !== "teacher" || localStreamRef.current) return;
    setMediaError(null);
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraEnabled(true);
      setMicrophoneEnabled(true);
      
      if (import.meta.env.DEV) {
        const videoTracks = localStreamRef.current.getVideoTracks();
        const audioTracks = localStreamRef.current.getAudioTracks();
        console.log("[WebRTC-Debug] Teacher media acquired:", {
          videoTracks: videoTracks.length,
          audioTracks: audioTracks.length,
          videoEnabled: videoTracks[0]?.enabled,
          audioEnabled: audioTracks[0]?.enabled,
        });
      }
    } catch {
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        setCameraEnabled(false);
        setMicrophoneEnabled(true);
        setMediaError("Camera access was denied. The class is continuing with audio only.");
        if (import.meta.env.DEV) {
          console.log("[WebRTC-Debug] Teacher media acquired (audio only)");
        }
      } catch {
        setMediaError("Camera and microphone access was denied. Check browser permissions.");
        if (import.meta.env.DEV) {
          console.error("[WebRTC-Debug] Failed to acquire teacher media");
        }
      }
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      void localVideoRef.current.play().catch(() => undefined);
    }
    for (const studentId of peerConnectionsRef.current.keys()) await createTeacherOffer(studentId);
  }, [createTeacherOffer, role]);

  const toggleMicrophone = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicrophoneEnabled(track.enabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraEnabled(track.enabled);
  }, []);

  const shareScreen = useCallback(async () => {
    if (role !== "teacher" || !navigator.mediaDevices.getDisplayMedia) return;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
      const screenTrack = screenStream.getVideoTracks()[0];
      if (!screenTrack) return;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
        void localVideoRef.current.play().catch(() => undefined);
      }
      for (const connection of peerConnectionsRef.current.values()) {
        const sender = connection.getSenders().find((item) => item.track?.kind === "video");
        if (sender) await sender.replaceTrack(screenTrack);
      }
      screenTrack.onended = () => {
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
        if (cameraTrack) {
          for (const connection of peerConnectionsRef.current.values()) {
            const sender = connection.getSenders().find((item) => item.track?.kind === "video");
            void sender?.replaceTrack(cameraTrack);
          }
          if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        }
        screenStreamRef.current = null;
      };
    } catch {
      setMediaError("Screen sharing was cancelled or unavailable.");
    }
  }, [role]);

  const endClass = useCallback(() => {
    const channel = channelRef.current;
    if (channel && role === "teacher") sendSignal(channel, "class-ended", { from: peerIdRef.current });
  }, [role]);

  const enableAudio = useCallback(() => {
    if (remoteVideoRef.current && role === "student") {
      remoteVideoRef.current.muted = false;
      if (remoteVideoRef.current.volume !== null) {
        remoteVideoRef.current.volume = 1;
      }
      void remoteVideoRef.current.play().catch((error) => {
        if (import.meta.env.DEV) {
          console.error("[WebRTC-Debug] Failed to enable audio playback:", error);
        }
      });
      setAudioEnabled(true);
      if (import.meta.env.DEV) {
        console.log("[WebRTC-Debug] Audio enabled for student");
      }
    }
  }, [role]);

  useEffect(() => {
    if (!active) return;
    mountedRef.current = true;
    const channel = supabase.channel(`live-media-${classId}`);
    channelRef.current = channel;

    const handleSignal = async ({ event, payload }: { event: string; payload: SignalPayload }) => {
      if (!mountedRef.current || payload.to && payload.to !== peerIdRef.current) return;
      if (event === "join" && role === "teacher" && payload.role === "student" && payload.peerId) {
        await createTeacherOffer(payload.peerId);
        return;
      }
      if (event === "offer" && role === "student" && payload.from && payload.description) {
        let connection = peerConnectionsRef.current.get(payload.from);
        if (!connection) {
          connection = new RTCPeerConnection(rtcConfiguration);
          peerConnectionsRef.current.set(payload.from, connection);
          connection.ontrack = (trackEvent) => {
            const [stream] = trackEvent.streams;
            if (import.meta.env.DEV) {
              const videoTracks = stream?.getVideoTracks() ?? [];
              const audioTracks = stream?.getAudioTracks() ?? [];
              console.log("[WebRTC-Debug] Student received remote tracks:", {
                videoTracks: videoTracks.length,
                audioTracks: audioTracks.length,
                videoEnabled: videoTracks[0]?.enabled,
                audioEnabled: audioTracks[0]?.enabled,
                trackKind: trackEvent.track.kind,
              });
            }
            if (stream && remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
              // Ensure remote video is NOT muted and audio can play
              remoteVideoRef.current.muted = false;
              if (remoteVideoRef.current.volume !== null) {
                remoteVideoRef.current.volume = 1;
              }
              void remoteVideoRef.current.play().catch((error) => {
                if (import.meta.env.DEV) {
                  console.warn("[WebRTC-Debug] Remote video autoplay blocked (likely browser autoplay policy):", error);
                }
              });
            }
          };
          connection.onicecandidate = (iceEvent) => {
            if (iceEvent.candidate) sendSignal(channel, "ice-candidate", { to: payload.from, from: peerIdRef.current, candidate: iceEvent.candidate.toJSON() });
          };
          connection.onconnectionstatechange = () => {
            if (connection?.connectionState === "connected") setStatus("connected");
            if (connection?.connectionState === "disconnected" || connection?.connectionState === "failed") setStatus("reconnecting");
          };
        }
        await connection.setRemoteDescription(payload.description);
        await addPendingCandidates(payload.from, connection);
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        sendSignal(channel, "answer", { to: payload.from, from: peerIdRef.current, description: answer });
        return;
      }
      if (event === "answer" && role === "teacher" && payload.from && payload.description) {
        const connection = peerConnectionsRef.current.get(payload.from);
        if (connection) await connection.setRemoteDescription(payload.description);
        return;
      }
      if (event === "ice-candidate" && payload.from && payload.candidate) {
        const connection = peerConnectionsRef.current.get(payload.from);
        if (!connection || !connection.remoteDescription) {
          const pending = pendingCandidatesRef.current.get(payload.from) ?? [];
          pending.push(payload.candidate);
          pendingCandidatesRef.current.set(payload.from, pending);
        } else {
          await connection.addIceCandidate(payload.candidate);
        }
        return;
      }
      if (event === "leave" && payload.peerId) closePeer(payload.peerId);
      if (event === "class-ended" && role === "student") setClassEnded(true);
    };

    channel.on("broadcast", { event: "join" }, handleSignal);
    channel.on("broadcast", { event: "offer" }, handleSignal);
    channel.on("broadcast", { event: "answer" }, handleSignal);
    channel.on("broadcast", { event: "ice-candidate" }, handleSignal);
    channel.on("broadcast", { event: "leave" }, handleSignal);
    channel.on("broadcast", { event: "class-ended" }, handleSignal);
    channel.subscribe((subscriptionStatus) => {
      if (subscriptionStatus === "SUBSCRIBED") {
        setStatus("connected");
        if (role === "student") sendSignal(channel, "join", { peerId: peerIdRef.current, role });
      }
      if (subscriptionStatus === "CHANNEL_ERROR" || subscriptionStatus === "TIMED_OUT") setStatus("reconnecting");
    });

    if (role === "student") {
      joinTimerRef.current = setInterval(() => {
        if (!peerConnectionsRef.current.size) sendSignal(channel, "join", { peerId: peerIdRef.current, role });
      }, 2500);
    }

    return () => {
      mountedRef.current = false;
      if (joinTimerRef.current) clearInterval(joinTimerRef.current);
      if (role === "teacher") sendSignal(channel, "class-ended", { from: peerIdRef.current });
      if (role === "student") sendSignal(channel, "leave", { peerId: peerIdRef.current });
      for (const peerId of peerConnectionsRef.current.keys()) closePeer(peerId);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      screenStreamRef.current = null;
      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [active, addPendingCandidates, classId, closePeer, createTeacherOffer, role]);

  return {
    status,
    mediaError,
    classEnded,
    cameraEnabled,
    microphoneEnabled,
    audioEnabled,
    localVideoRef,
    remoteVideoRef,
    startLocalMedia,
    toggleMicrophone,
    toggleCamera,
    shareScreen,
    enableAudio,
    endClass,
  };
}
