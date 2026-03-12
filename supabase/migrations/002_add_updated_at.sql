-- Add updated_at column to valuations
ALTER TABLE valuations ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

-- Backfill existing rows
UPDATE valuations SET updated_at = created_at WHERE updated_at IS NULL;

-- Auto-update trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to valuations
CREATE TRIGGER valuations_updated_at
  BEFORE UPDATE ON valuations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Composite index for rate limiting in /api/capture
CREATE INDEX idx_valuations_ip_created ON valuations(ip_address, created_at);
