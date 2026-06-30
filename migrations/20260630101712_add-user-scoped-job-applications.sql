create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text not null,
  status text not null default 'interested',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_applications
  enable row level security;

create or replace function public.set_job_application_user_id()
returns trigger as $$
begin
  new.user_id := coalesce(new.user_id, auth.uid());
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger trg_job_applications_set_user_id
before insert on public.job_applications
for each row
execute function public.set_job_application_user_id();

create policy "Users can view their own job applications"
  on public.job_applications
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own job applications"
  on public.job_applications
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own job applications"
  on public.job_applications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own job applications"
  on public.job_applications
  for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.job_applications to authenticated;
