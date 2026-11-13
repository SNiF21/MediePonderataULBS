import { Routes } from '@angular/router';

import { ProfileComponent } from './profile/profile';
import { Calculator } from './calculator/calculator';
import { AuthComponent } from './auth/auth';
import { ContactComponent } from './contact/contact';
import { PrivacyPolicyComponent } from './legal/privacy-policy';
import { emailVerifiedGuard } from './guards/email-verified.guard';

export const routes: Routes = [
	{ path: '', component: ProfileComponent },
	{ path: 'profile', redirectTo: '', pathMatch: 'full' },
	{ path: 'calculator', component: Calculator, canActivate: [emailVerifiedGuard] },
	{ path: 'contact', component: ContactComponent },
	{ path: 'login', component: AuthComponent },
	{ path: 'auth', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'confidentialitate', component: PrivacyPolicyComponent },
	{ path: 'termeni', redirectTo: 'confidentialitate', pathMatch: 'full' },
	{ path: 'gdpr', redirectTo: 'confidentialitate', pathMatch: 'full' },
	{ path: '**', redirectTo: '' },
];
