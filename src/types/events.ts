export interface ActionSheetOption {
    icon?: JSX.Element;
    text: string;
    callback: () => void;
}

export interface ActionSheetEvent {
    options: ActionSheetOption[];
}

export interface ChatMediaModalEvent {
    uri: string;
    showActionBar: boolean;
    showSaveButton: boolean;
}
