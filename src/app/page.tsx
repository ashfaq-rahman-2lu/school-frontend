import { headers } from 'next/headers';
import { SchoolShell, UnavailableSchool } from '../components/school-shell';
import { readSchool } from '../lib/backend';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default async function Home() {
  const requestHeaders = await headers();
  const school = await readSchool(requestHeaders.get('host') ?? '');
  return school ? <SchoolShell name={school.name} /> : <UnavailableSchool />;
}
