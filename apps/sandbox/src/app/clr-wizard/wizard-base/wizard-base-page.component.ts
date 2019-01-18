import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { HlcClrWizard } from '@ng-holistic/clr-wizard';
import { map, tap } from 'rxjs/operators';
import { WizardPageService } from './wizard-base-page.service';

const pages = (dataAccess: WizardPageService): HlcClrWizard.WizardStepLayout[] => {
    let adminExists = false;
    let companyId: number | undefined;
    return [
        {
            id: 'adminEmailPage',
            title: 'Admin Email',
            navTitle: 'Admin Email',
            fields: [
                {
                    id: 'adminEmail',
                    kind: 'TextField',
                    label: 'Admin Email',
                    $validators: [Validators.required, Validators.email]
                }
            ],
            commit(vals) {
                return dataAccess.checkEmailUserRole(vals.adminEmailPage.adminEmail).pipe(
                    map(role => {
                        if (role === 'Manager' || role === 'User') {
                            // tslint:disable-next-line:no-string-throw
                            throw `User with email already refistered in system but has role different
                                from manager. We could not register new manager with this email.
                                Plaese choose another one.`;
                        } else {
                            adminExists = role === 'Admin';
                            return role;
                        }
                    })
                );
            }
        },
        {
            id: 'adminExistsHintPage',
            title: 'Admin Info',
            navTitle: 'Admin Info',
            skip() {
                return !adminExists;
            }
        },
        {
            id: 'adminInfoPage',
            title: 'Admin Info',
            navTitle: 'Admin Info',
            fields: [
                {
                    id: 'firstName',
                    kind: 'TextField',
                    label: 'First Name',
                    $validators: [Validators.required]
                },
                {
                    id: 'lastName',
                    kind: 'TextField',
                    label: 'Last Name',
                    $validators: [Validators.required]
                }
            ],
            commit(vals) {
                return dataAccess.validateAdmin(vals.adminInfoPage);
            },
            skip() {
                return adminExists;
            }
        },
        {
            id: 'companyInfoPage',
            title: 'Company Info',
            navTitle: 'Company Info',
            fields: [
                {
                    id: 'companyName',
                    kind: 'TextField',
                    label: 'Name',
                    $validators: [Validators.required]
                }
            ],
            commit(val) {
                return dataAccess.validateCopmany(val.companyInfoPage).pipe(tap(() => (companyId = 1)));
            }
        },
        {
            id: 'finishPage',
            title: 'Complete',
            navTitle: 'Complete',
            context: { companyId },
            buttons: {
                finish: {
                    text: 'Create next'
                }
            }
        }
    ];
};

@Component({
    selector: 'hlc-wizard-base-page',
    templateUrl: './wizard-base-page.component.html',
    styleUrls: ['./wizard-base-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardBasePageComponent {
    readonly pages: HlcClrWizard.WizardStepLayout[];
    constructor(dataAccess: WizardPageService) {
        this.pages = pages(dataAccess);
    }
}
