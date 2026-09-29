CREATE TABLE public.verification_items (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_items TO anon, authenticated;
GRANT ALL ON public.verification_items TO service_role;
ALTER TABLE public.verification_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo read items" ON public.verification_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "demo write items" ON public.verification_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "demo update items" ON public.verification_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo reset items" ON public.verification_items FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE public.verification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL,
  type text NOT NULL,
  detail text NOT NULL DEFAULT '',
  reviewer text NOT NULL,
  version int NOT NULL,
  at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.verification_events TO anon, authenticated;
GRANT ALL ON public.verification_events TO service_role;
ALTER TABLE public.verification_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo read events" ON public.verification_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "append-only events" ON public.verification_events FOR INSERT TO anon, authenticated WITH CHECK (true);