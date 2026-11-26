import { redirect } from 'next/navigation';
import { getMenu } from '@/lib/menu';

export default async function MenuIndex() {
  const menu = await getMenu();
  redirect(`/menu/${menu.secciones[0]?.id ?? 'ramen-sushi'}`);
}
