-- Add merch gender (fit) for welcome drop, collected with T-shirt at application time.

alter table public.invite_applications
  add column if not exists merch_gender text
    check (merch_gender in ('male', 'female', 'unisex'));

-- Backfill for existing rows (if any) before set not null; then enforce.
update public.invite_applications
set merch_gender = 'unisex'
where merch_gender is null;

alter table public.invite_applications
  alter column merch_gender set not null;
