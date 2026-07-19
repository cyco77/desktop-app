import { buildPreviewFeatureFlags, PREVIEW_FEATURE_IDS, PreviewFeatureId, UserSettings } from "../../common/types";

interface PreviewFeatureDefinition {
    id: PreviewFeatureId;
    label: string;
    description: string;
    targetElementIds: string[];
}

const PREVIEW_FEATURE_SETTINGS_ID_PREFIX = "sidebar-preview-feature-";

const PREVIEW_FEATURE_DEFINITIONS: PreviewFeatureDefinition[] = [
    {
        id: PREVIEW_FEATURE_IDS.MCP_SERVER,
        label: "MCP Server",
        description: "Shows the MCP Server activity in the sidebar.",
        targetElementIds: ["mcp-btn"],
    },
    {
        id: PREVIEW_FEATURE_IDS.POWER_PLATFORM_API,
        label: "Power Platform API",
        description: "Shows Power Platform API options in connection add/edit flows.",
        targetElementIds: [],
    },
];

let activePreviewFeatureFlags: Record<PreviewFeatureId, boolean> = buildPreviewFeatureFlags();

function toggleElementVisibilityById(elementId: string, isVisible: boolean): void {
    const element = document.getElementById(elementId) as HTMLElement | null;
    if (element) {
        element.style.display = isVisible ? "" : "none";
    }
}

export function getPreviewFeatureDefinitions(): PreviewFeatureDefinition[] {
    return PREVIEW_FEATURE_DEFINITIONS.slice();
}

export function getPreviewFeatureCheckboxId(featureId: PreviewFeatureId): string {
    return `${PREVIEW_FEATURE_SETTINGS_ID_PREFIX}${featureId}`;
}

export function normalizePreviewFeatureFlags(settings: Pick<UserSettings, "previewFeatures" | "enablePreviewFeatures">): Record<PreviewFeatureId, boolean> {
    return buildPreviewFeatureFlags(settings.previewFeatures, settings.enablePreviewFeatures);
}

export function collectPreviewFeatureFlagsFromSettingsPanel(): Record<PreviewFeatureId, boolean> {
    const featureFlags = buildPreviewFeatureFlags();

    PREVIEW_FEATURE_DEFINITIONS.forEach((feature) => {
        const checkbox = document.getElementById(getPreviewFeatureCheckboxId(feature.id)) as HTMLInputElement | null;
        featureFlags[feature.id] = checkbox?.checked === true;
    });

    return featureFlags;
}

/**
 * Apply preview feature visibility to the current renderer surface.
 */
export function applyPreviewFeaturesVisibility(features: Record<PreviewFeatureId, boolean>): void {
    activePreviewFeatureFlags = buildPreviewFeatureFlags(features);

    PREVIEW_FEATURE_DEFINITIONS.forEach((feature) => {
        const isEnabled = activePreviewFeatureFlags[feature.id] === true;
        feature.targetElementIds.forEach((elementId) => {
            toggleElementVisibilityById(elementId, isEnabled);
        });
    });
}

export function isPreviewFeatureEnabled(featureId: PreviewFeatureId): boolean {
    return activePreviewFeatureFlags[featureId] === true;
}
