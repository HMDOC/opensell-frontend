import { Component, ReactElement, ReactNode, RefObject, createRef} from "react";

interface TagSelectorProperties {
    tagArray: string[],
    selectedTagsLimit?: number,
    tagCatalogLabel?: string,
    showCatalogButtonText?: string,
    inputNameAttribute: string
}

interface TagSelectorState {
    selectedTags: string[],
    hiddenInputRef: RefObject<HTMLInputElement>,
    catalogRef: RefObject<HTMLDivElement>,
    catalogIsHidden: boolean,
    selectedTagsLimit: number
}

/**
 * @author Olivier Mansuy
 * @Note 
 * - [hidden] needs to be changed to something more secure
 * - [type="button"] is important, because a button without a type in a form is considered a submit button by default
 * - [componentDidUpdate] triggers when this.setState() is used
 * - the [delimiter] between the values in the hidden inputField could be changed to something else (something other than ",")
 */
export default class TagSelector extends Component<TagSelectorProperties, TagSelectorState> {
    constructor(properties: TagSelectorProperties) {
        super(properties)
        this.state = {
            selectedTags: [],
            hiddenInputRef: createRef(),
            catalogRef: createRef(),
            catalogIsHidden: false,
            selectedTagsLimit: this.props.selectedTagsLimit && this.props.selectedTagsLimit > 0 ? this.props.selectedTagsLimit : -1
        }
    }

    private static TAG_SELECTED_CLASS: string = "tag-display-selected";
    private static DEFAULT_CATALOG_LABEL: string = "Tags";
    private static DEFAULT_SHOW_CATALOG_BUTTON_TEXT = "Show catalog";
   
    //
    private switchCatalogState() {
        this.setState({
            ...this.state,
            catalogIsHidden: !this.state.catalogIsHidden
        });
    }

    private onCatalogStateSwitch() {
        if (this.state.catalogIsHidden) {
            this.state.catalogRef.current.classList.replace("hidden", "fadeIn");
        } else {
            this.state.catalogRef.current.classList.replace("fadeIn", "hidden");
        };
    }

    //
    private onSelectedTagsChange() {
        //console.log("UPDATE : " + this.state.selectedTags);
        this.state.hiddenInputRef.current.value = this.state.selectedTags.toString();
    }

    //
    componentDidUpdate(prevProps: Readonly<TagSelectorProperties>, prevState: Readonly<TagSelectorState>, snapshot?: any): void {
        this.onSelectedTagsChange();
        this.onCatalogStateSwitch();

    }

    //
    private removeTag(name: string): void {
        this.setState({
            ...this.state,
            selectedTags: this.state.selectedTags.filter((elem) => elem !== name)
        })
    }

    //
    private addTag(name: string): void {
        this.setState({
            ...this.state,
            selectedTags: [...this.state.selectedTags, name]
        })
    }

    //
    private onTagSelect(element: HTMLDivElement): void {
        const {id} = element;
        const {selectedTags, selectedTagsLimit} = this.state;
        if (selectedTagsLimit > 0 && selectedTags.length < selectedTagsLimit) {
            this.addTag(id);
            element.classList.add(TagSelector.TAG_SELECTED_CLASS);
        } else if (selectedTagsLimit == -1) {
            this.addTag(id);
            element.classList.add(TagSelector.TAG_SELECTED_CLASS);
        } else {
            //doesn't add
            //add feedback
        }
    }

    //
    private onTagUnSelect(element: HTMLDivElement): void {
        const {id} = element;
        this.removeTag(id);
        element.classList.remove(TagSelector.TAG_SELECTED_CLASS);
    }

    private tagOnClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const {currentTarget} = event;
        if (this.state.selectedTags.includes(currentTarget.id)) this.onTagUnSelect(currentTarget);
        else this.onTagSelect(currentTarget);
    }

    render(): ReactNode {
        return(
            <div>
                <div> 
                    <button type="button" onClick={() => this.switchCatalogState()}>{this.props.showCatalogButtonText ? this.props.showCatalogButtonText : TagSelector.DEFAULT_SHOW_CATALOG_BUTTON_TEXT}</button>
                </div>

                <div className="tag-catalog hidden" ref={this.state.catalogRef}>
                    <label>{this.props.tagCatalogLabel ? this.props.tagCatalogLabel : TagSelector.DEFAULT_CATALOG_LABEL}</label>
                    {this.props.tagArray.map((elem) => (
                        <div id={elem} className="tag-display" key={elem} onClick={(divElement) => this.tagOnClick(divElement)}>
                            <span>{elem}</span>
                        </div>
                    ))}
                </div>
                
                <input type="text" name={this.props.inputNameAttribute} hidden ref={this.state.hiddenInputRef}/>
            </div>
        )
    }
}