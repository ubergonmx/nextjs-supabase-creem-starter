'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import type { AuthActionState } from '../types';
import { profileSchema } from '../schema';

export async function updateProfile(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = { fullName: formData.get('fullName') };
  const result = profileSchema.safeParse(raw);

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const user = await getUser();

  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: result.data.fullName })
    .eq('id', user.id);

  if (error) return { error: error.message };

  return {};
}
