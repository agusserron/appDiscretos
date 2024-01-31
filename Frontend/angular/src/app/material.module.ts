import {NgModule } from "@angular/core";
import {MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule } from "@angular/material/card";
import {MatDialogModule } from "@angular/material/dialog";
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule } from '@angular/material/core';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from "@angular/material/paginator";
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTableExporterModule } from "mat-table-exporter";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
    exports: [
        MatSlideToggleModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatRippleModule,
        MatToolbarModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatStepperModule,
        MatDividerModule,
        MatListModule,
        MatSelectModule,
        MatGridListModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        TextFieldModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatTableExporterModule,
        MatSidenavModule,
        MatTabsModule,
        MatChipsModule
    ]
})
export class MaterialModule { }