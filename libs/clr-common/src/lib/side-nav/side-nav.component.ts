import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    InjectionToken,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HlcHotkeysContainerService } from '../hotkeys/hotkeys-container.service';
import { HlcSideNavKeysManagerService } from './utils/side-nav-keys-manager';

export interface SideNavChildItem {
    title: string;
    path?: any[];
    icon?: string;
}

export interface SideNavItem {
    title: string;
    icon?: string;
    path?: string;
    children?: SideNavChildItem[];
}

export interface HlcSideNavConfig {
    onNavigate: (path: any) => any;
    isActive: (path: any) => boolean;
    navigationEnds$?: Observable<any>;
}

export const HLC_SIDE_NAV_CONFIG = new InjectionToken<HlcSideNavConfig>('HLC_SIDE_NAV_CONFIG');

/**
 * When user click on side nav item menu we use HlcSideNavConfig interface in order to navigate to particular path.
 * In most common case scenario we need to use router to navigate to some page.
 */
export const routerSideNavConfigProvider = (router: Router): HlcSideNavConfig => ({
    onNavigate: path => {
        const isCommandsPath = Array.isArray(path);
        console.log(path, isCommandsPath);
        router.navigate(isCommandsPath ? path : [path]);
    },
    isActive: path => {
        const isCommandsPath = Array.isArray(path);
        const urlTree = path && router.createUrlTree(isCommandsPath ? path : [path]);
        return urlTree && router.isActive(urlTree, false);
    },
    navigationEnds$: router.events.pipe(filter(event => event instanceof NavigationEnd))
});

@Component({
    selector: 'hlc-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [HlcHotkeysContainerService, HlcSideNavKeysManagerService]
})
export class HlcClrSideNavComponent implements OnInit, OnDestroy {
    collapsed: boolean;
    @Input() items: SideNavItem[];

    constructor(
        private readonly hotkeysContainer: HlcHotkeysContainerService,
        sidenavKeysManager: HlcSideNavKeysManagerService,
        cdr: ChangeDetectorRef,
        @Inject(HLC_SIDE_NAV_CONFIG) private readonly config: HlcSideNavConfig
    ) {
        hotkeysContainer.focus$.next(true);
        sidenavKeysManager.toggle$.pipe(takeUntil(this.hotkeysContainer.destroy$)).subscribe(() => {
            this.collapsed = !this.collapsed;
            cdr.markForCheck();
        });
        if (config.navigationEnds$) {
            config.navigationEnds$.pipe(takeUntil(this.hotkeysContainer.destroy$)).subscribe(() => cdr.markForCheck());
        }
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.hotkeysContainer.destroy$.next();
    }

    onItemClick(path: string) {
        this.config.onNavigate(path);
    }

    isItemActive(path: string) {
        return this.config.isActive(path);
    }
}
