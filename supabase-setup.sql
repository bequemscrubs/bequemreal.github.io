-- ======================================================
-- BEQUEM SCRUBS — SUPABASE SETUP
-- ======================================================
--
-- Run this once in the Supabase dashboard: SQL Editor -> New query
-- -> paste -> Run.
--
-- What it does:
--   1. Locks down the "reviews" table with RLS
--   2. Lets anonymous visitors read approved reviews and submit new ones
--   3. Lets a logged in admin read, approve and delete everything
--   4. Creates the public storage bucket used for review photos
--
-- The admin password is never stored in the website code. It lives in
-- Supabase Auth, and these policies are what actually protect the data.
--
-- ======================================================


-- ======================================================
-- 1. REVIEWS TABLE
-- ======================================================

alter table public.reviews enable row level security;


-- --- Anonymous visitors ---

-- Read: only approved reviews are ever exposed publicly.

drop policy if exists "bequem_public_read_approved" on public.reviews;

create policy "bequem_public_read_approved"
on public.reviews
for select
to anon
using (approved = true);


-- Insert: anyone can submit a review, but it always lands unapproved.
-- The "with check" is what stops someone from self-approving.

drop policy if exists "bequem_public_insert_pending" on public.reviews;

create policy "bequem_public_insert_pending"
on public.reviews
for insert
to anon
with check (approved = false);


-- --- Admin (logged in) ---

drop policy if exists "bequem_admin_read_all" on public.reviews;

create policy "bequem_admin_read_all"
on public.reviews
for select
to authenticated
using (true);


drop policy if exists "bequem_admin_update" on public.reviews;

create policy "bequem_admin_update"
on public.reviews
for update
to authenticated
using (true)
with check (true);


drop policy if exists "bequem_admin_delete" on public.reviews;

create policy "bequem_admin_delete"
on public.reviews
for delete
to authenticated
using (true);


-- ======================================================
-- 2. STORAGE BUCKET FOR REVIEW PHOTOS
-- ======================================================

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do update set public = true;


-- Anyone can upload a photo attached to their review...

drop policy if exists "bequem_public_upload_photos" on storage.objects;

create policy "bequem_public_upload_photos"
on storage.objects
for insert
to anon
with check (bucket_id = 'review-photos');


-- ...and anyone can view them (the bucket is public).

drop policy if exists "bequem_public_read_photos" on storage.objects;

create policy "bequem_public_read_photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'review-photos');


-- Only the admin can delete a photo.

drop policy if exists "bequem_admin_delete_photos" on storage.objects;

create policy "bequem_admin_delete_photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'review-photos');


-- ======================================================
-- 3. IMPORTANT — AFTER RUNNING THIS
-- ======================================================
--
-- The admin policies above trust ANY logged in user. That is safe only
-- if you are the only account that can exist. So:
--
--   Dashboard -> Authentication -> Sign In / Providers -> Email
--   -> turn OFF "Allow new users to sign up"
--
-- Then create your own account manually:
--
--   Dashboard -> Authentication -> Users -> Add user
--   -> "Create new user", enter your email + a strong password,
--      tick "Auto Confirm User"
--
-- Optional, stricter: restrict the admin policies to your user id only.
-- Copy your id from Authentication -> Users, then replace the three
-- admin policies above with `using (auth.uid() = 'your-uuid-here')`.
-- That stays safe even if sign-ups are ever re-enabled.
--
-- ======================================================
