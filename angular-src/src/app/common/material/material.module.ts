import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule, MatSnackBarModule} from '@angular/material';
import {NgModule} from "@angular/core";

@NgModule({
  imports: [MatButtonModule, MatToolbarModule, MatMenuModule, MatSelectModule,
    MatTabsModule, MatInputModule, MatProgressSpinnerModule, MatChipsModule,
    MatSidenavModule, MatCheckboxModule, MatCardModule, MatListModule, MatIconModule,
    MatTooltipModule, MatFormFieldModule, MatSnackBarModule],
  exports: [MatButtonModule, MatToolbarModule, MatMenuModule, MatSelectModule,
    MatTabsModule, MatInputModule, MatProgressSpinnerModule, MatChipsModule,
    MatSidenavModule, MatCheckboxModule, MatCardModule, MatListModule, MatIconModule,
    MatTooltipModule, MatFormFieldModule, MatSnackBarModule],
})
export class MaterialModule { }
