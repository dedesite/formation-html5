const $ = window.$;

const NAME = 'workflow';
const JQUERY_NO_CONFLICT = $.fn[NAME];

const Action = {
    PREV: "prev",
    NEXT: "next"
};

const TAG = "section";


const ClassName = {
    ACTIVE: "active"
};

const AttrName = {
    WORKFLOW: "data-workflow"
};

const Selector = {
    ACTIVE: `${TAG}.${ClassName.ACTIVE}`,
    WORKFLOW: `${TAG}[${AttrName.WORKFLOW}=`
};


class Workflow {
    constructor(element, config) {
        this._element = element;

        if (config === Action.NEXT || config === Action.PREV) {
            const currActive = this._element.children(Selector.ACTIVE);
            const nextActive = config === Action.NEXT ? currActive.next() : currActive.prev();
            if(nextActive.length === 0) {
                return false;
            }
            this.activateElement(nextActive);
        }

        const activeSection = this._element.children(Selector.ACTIVE).first();
        this.showActiveElement(activeSection);

        if(config && config.manageHistory) {
            this.manageHistory(activeSection);

            window.onpopstate = e => {
                if(e.state !== null && e.state.workflow) {
                    this.activateWorkflow(e.state.workflow);
                }
            }
        }

        if(config && config.handleHashChange) {
            window.onhashchange = () => this.activateWorkflow(location.hash.substring(1));
        }
    }

    manageHistory(el) {
        const workflow = $(el).attr(AttrName.WORKFLOW);
        // Try to avoid having a first pushState but doesn't work with internal link
        // if(window.history.state === null) {
        //     console.log("replace", window.history);
        //     window.history.replaceState({workflow}, workflow, `#${workflow}`);    
        // } else {
        //     window.history.pushState({workflow}, workflow, `#${workflow}`);  
        // }
        window.history.pushState({workflow}, workflow, `#${workflow}`);  
    }

    activateElement(el) {
        this._element.children(Selector.ACTIVE).removeClass(ClassName.ACTIVE);
        el.addClass("active");
    }

    showActiveElement(el) {
        this._element.children(TAG).not(`.${ClassName.ACTIVE}`).hide();
        el.show();
    }

    activateWorkflow(workflow) {
        const toActivate = this._element.children(`${Selector.WORKFLOW}'${workflow}']`).first();
        if(toActivate.length) {
            this.activateElement(toActivate);
            this.showActiveElement(toActivate);
        }
    }

    static _jQueryInterface(config) {
        return this.each((_, item) => {
            new Workflow($(item), config);
        })
    }
}


$.fn[NAME] = Workflow._jQueryInterface;
$.fn[NAME].Constructor = Workflow;
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT;
  return Workflow._jQueryInterface;
}

export default Workflow;