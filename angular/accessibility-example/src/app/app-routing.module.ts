import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule } from '@angular/router';
import { AccessibleRoute, AccessibleRoutes } from '@modules/accessibility';
import { HelpCenterComponent } from '@pages/help-center/help-center.component';
import { HomeComponent } from '@pages/home/home.component';
import { ProfileComponent } from '@pages/profile/profile.component';

const ROUTES: AccessibleRoutes = [{
  path: 'profile',
  component: ProfileComponent,
  data: {
    accessibility: {
      title: {
        sections: {
          title: 'Profile'
        },
        delimiters: {
          modifier: ' of '
        }
      }
    }
  }
}, {
  path: 'help',
  component: HelpCenterComponent,
  data: {
    accessibility: {
      title: {
        sections: {
          title: 'Help Center'
        }
      }
    }
  }
}, {
  path: '',
  component: HomeComponent,
  data: {
    accessibility: {
      title: {
        sections: {
          title: 'Home',
          modifier: 'Activity Feed'
        }
      },
      heading: 'Your Activity Feed'
    }
  }
}, {
  path: '**',
  redirectTo: ''
} as AccessibleRoute];

const OPTIONS: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled'
};

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, OPTIONS)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
