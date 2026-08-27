CREATE TABLE public.live_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  subject text NOT NULL,
  grade text NOT NULL,
  teacher_lang text NOT NULL DEFAULT 'en',
  teacher_name text,
  is_live boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.live_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  source_text text NOT NULL,
  source_lang text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX live_messages_class_idx ON public.live_messages (class_id, created_at);

GRANT SELECT, INSERT, UPDATE ON public.live_classes TO anon, authenticated;
GRANT ALL ON public.live_classes TO service_role;
GRANT SELECT, INSERT ON public.live_messages TO anon, authenticated;
GRANT ALL ON public.live_messages TO service_role;

ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read classes" ON public.live_classes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create classes" ON public.live_classes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update class live state" ON public.live_classes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read class messages" ON public.live_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can post class messages" ON public.live_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.live_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_classes;
ALTER TABLE public.live_messages REPLICA IDENTITY FULL;
ALTER TABLE public.live_classes REPLICA IDENTITY FULL;