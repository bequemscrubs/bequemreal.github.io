-- ======================================================
-- BEQUEM SCRUBS — SUPABASE SETUP
-- ======================================================
--
-- Run this once: Supabase dashboard -> SQL Editor -> New query
-- -> paste -> Run.
--
-- ------------------------------------------------------
-- WHAT THIS DOES, IN PLAIN TERMS
-- ------------------------------------------------------
--
-- It opens the "reviews" table to the public key: reading every
-- review (including the ones waiting for approval), inserting,
-- approving and deleting.
--
-- That is what makes admin.html work without a Supabase account.
-- It also means the login on that page is a convenience gate, not
-- protection: the public key is visible in the page source, so
-- anyone who opens the browser console can approve or delete
-- reviews without ever seeing the password.
--
-- This is a deliberate trade-off. The SECURE VERSION at the bottom
-- of this file closes it back down when you are ready.
--
-- ======================================================


-- ======================================================
-- 1. REVIEWS TABLE — OPEN ACCESS
-- ======================================================

alter table public.reviews enable row level security;


-- Clean up any policy from a previous run of this file.

drop policy if exists "bequem_public_read_approved"  on public.reviews;
drop policy if exists "bequem_public_insert_pending" on public.reviews;
drop policy if exists "bequem_admin_read_all"        on public.reviews;
drop policy if exists "bequem_admin_update"          on public.reviews;
drop policy if exists "bequem_admin_delete"          on public.reviews;

drop policy if exists "bequem_anon_select_all" on public.reviews;
drop policy if exists "bequem_anon_insert"     on public.reviews;
drop policy if exists "bequem_anon_update"     on public.reviews;
drop policy if exists "bequem_anon_delete"     on public.reviews;


-- Read every review.
-- reviews.html still only displays approved ones: it filters with
-- .eq("approved", true) in the query itself.

create policy "bequem_anon_select_all"
on public.reviews
for select
to anon
using (true);


-- Submit a review from the public form.

create policy "bequem_anon_insert"
on public.reviews
for insert
to anon
with check (true);


-- Approve / unpublish, used by admin.html.

create policy "bequem_anon_update"
on public.reviews
for update
to anon
using (true)
with check (true);


-- Delete, used by admin.html.

create policy "bequem_anon_delete"
on public.reviews
for delete
to anon
using (true);


-- ======================================================
-- 2. STORAGE BUCKET FOR REVIEW PHOTOS
-- ======================================================
--
-- This bucket does not exist yet, which is why photo upload
-- currently fails with "Bucket not found" and reviews are saved
-- without their photos.

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do update set public = true;


drop policy if exists "bequem_public_upload_photos" on storage.objects;
drop policy if exists "bequem_public_read_photos"   on storage.objects;
drop policy if exists "bequem_admin_delete_photos"  on storage.objects;


create policy "bequem_public_upload_photos"
on storage.objects
for insert
to anon
with check (bucket_id = 'review-photos');


create policy "bequem_public_read_photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'review-photos');


create policy "bequem_admin_delete_photos"
on storage.objects
for delete
to anon
using (bucket_id = 'review-photos');


-- ======================================================
-- 3. SECURE VERSION — FOR LATER
-- ======================================================
--
-- When you want real protection, do these three things:
--
--   a) Supabase -> Authentication -> Users -> Add user
--      -> Create new user, your email + a strong password,
--         tick "Auto Confirm User"
--
--   b) Supabase -> Authentication -> Sign In / Providers -> Email
--      -> turn OFF "Allow new users to sign up"
--
--   c) run the block below, then swap the password gate in admin.js
--      for client.auth.signInWithPassword()
--
-- After that the public key can only read approved reviews and
-- submit new ones. Approving and deleting require being logged in,
-- and it is Supabase that enforces it, not the page.
--
-- ------------------------------------------------------
--
-- drop policy if exists "bequem_anon_select_all" on public.reviews;
-- drop policy if exists "bequem_anon_insert"     on public.reviews;
-- drop policy if exists "bequem_anon_update"     on public.reviews;
-- drop policy if exists "bequem_anon_delete"     on public.reviews;
--
-- create policy "bequem_public_read_approved"
-- on public.reviews for select to anon
-- using (approved = true);
--
-- create policy "bequem_public_insert_pending"
-- on public.reviews for insert to anon
-- with check (approved = false);
--
-- create policy "bequem_admin_read_all"
-- on public.reviews for select to authenticated
-- using (true);
--
-- create policy "bequem_admin_update"
-- on public.reviews for update to authenticated
-- using (true) with check (true);
--
-- create policy "bequem_admin_delete"
-- on public.reviews for delete to authenticated
-- using (true);
--
-- drop policy if exists "bequem_admin_delete_photos" on storage.objects;
--
-- create policy "bequem_admin_delete_photos"
-- on storage.objects for delete to authenticated
-- using (bucket_id = 'review-photos');
--
-- ======================================================
