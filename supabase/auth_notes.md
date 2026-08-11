# Supabase Auth & JWT Flow

1. Frontend authenticates with Supabase Auth (Client SDK).
2. Frontend sends requests to backend with header: `Authorization: Bearer <SUPABASE_JWT_ACCESS_TOKEN>`.
3. Backend verifies the JWT using Supabase Client (`supabase.auth.get_user(token)`) and extracts `user_id`.
4. Database queries filter by `user_id` enforced by Row-Level Security (RLS).