import { supabase } from "@/integrations/supabase/client";

export type LiveClass = {
  id: string;
  code: string;
  name: string;
  subject: string;
  grade: string;
  teacher_lang: string;
  teacher_name: string | null;
  is_live: boolean;
  created_at: string;
};

export type LiveMessage = {
  id: string;
  class_id: string;
  source_text: string;
  source_lang: string;
  created_at: string;
};

function generateCode() {
  return `VIDYA-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const liveService = {
  async createClass(input: {
    name: string;
    subject: string;
    grade: string;
    teacherLang: string;
    teacherName?: string | null;
  }): Promise<LiveClass> {
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data, error } = await supabase
        .from("live_classes")
        .insert({
          code: generateCode(),
          name: input.name,
          subject: input.subject,
          grade: input.grade,
          teacher_lang: input.teacherLang,
          teacher_name: input.teacherName ?? null,
        })
        .select()
        .single();
      if (!error && data) return data as LiveClass;
      lastError = error;
      if (error && error.code !== "23505") break;
    }
    throw new Error(
      (lastError as { message?: string })?.message ?? "Could not create the class.",
    );
  },

  async getByCode(code: string): Promise<LiveClass | null> {
    const { data, error } = await supabase
      .from("live_classes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as LiveClass | null) ?? null;
  },

  async setLive(id: string, isLive: boolean) {
    const { error } = await supabase
      .from("live_classes")
      .update({ is_live: isLive })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  async postMessage(classId: string, text: string, lang: string) {
    const { error } = await supabase
      .from("live_messages")
      .insert({ class_id: classId, source_text: text, source_lang: lang });
    if (error) throw new Error(error.message);
  },

  async listMessages(classId: string): Promise<LiveMessage[]> {
    const { data, error } = await supabase
      .from("live_messages")
      .select("*")
      .eq("class_id", classId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as LiveMessage[];
  },
};
