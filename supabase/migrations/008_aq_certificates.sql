-- Migration 008: AQ certificates — server-side issuance + public verification
--
-- Before this, the certificate "verification code" was generated client-side
-- with Math.random and never stored, and the verify URL printed on the card
-- (aq.ai.kr/cert/XXXX-XXXX) 404'd. A certificate that claims to be verifiable
-- but isn't is worse than no certificate. This table makes the code real.
--
-- How to apply:
--   Option A — Supabase Dashboard → SQL Editor → paste this file → Run
--   Option B — supabase db push
--
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS aq_certificates (
  code          TEXT PRIMARY KEY,                       -- 'XXXX-XXXX' (Crockford-ish alphabet, no 0/O/1/I)
  total_score   SMALLINT NOT NULL CHECK (total_score BETWEEN 0 AND 200),
  grade         TEXT NOT NULL CHECK (grade IN ('S','A','B','C','D')),
  domains       JSONB NOT NULL,                         -- [{domain, rawScore, weightedScore, grade}]
  percentile    SMALLINT,                               -- estimate at issue time (see 009 when real distribution exists)
  duration_seconds INTEGER,
  tested_at     TIMESTAMPTZ NOT NULL,
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- nullable: no login required
  issuer_ip_hash TEXT                                   -- sha256(ip) for abuse review only, never exposed
);

CREATE INDEX IF NOT EXISTS idx_aq_certificates_issued_at ON aq_certificates (issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_aq_certificates_user ON aq_certificates (user_id) WHERE user_id IS NOT NULL;

-- RLS: nobody reads/writes via anon key. Issuance and verification both go
-- through API routes using the service role, so verification can return a
-- deliberately narrow projection (score/grade/date) and never ip hash / user_id.
ALTER TABLE aq_certificates ENABLE ROW LEVEL SECURITY;
