import type { Metadata } from 'next';
import CareersClient from './CareersClient';
import SiteFooter from '../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Careers — Auxerta',
  description: 'Join Auxerta. Build expert-reviewed training data for serious ML teams.',
};

// Ensure the “open role” can be randomized per request.
export const dynamic = 'force-dynamic';

export default function CareersPage() {
  return <CareersClient />;
}