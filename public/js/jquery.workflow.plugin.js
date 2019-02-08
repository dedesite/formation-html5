($ => {
    function manageHistory(el) {
        const workflow = $(el).attr('data-workflow');
        // Try to avoid having a first pushState but doesn't work with internal link
        // if(window.history.state === null) {
        //     console.log("replace", window.history);
        //     window.history.replaceState({workflow}, workflow, `#${workflow}`);    
        // } else {
        //     window.history.pushState({workflow}, workflow, `#${workflow}`);  
        // }
        window.history.pushState({workflow}, workflow, `#${workflow}`);  
    }

    function activateElement(parent, el) {
        parent.children("section.active").removeClass("active");
        el.addClass("active");
    }

    function showActiveElement(parent, el) {
        parent.children("section").not(".active").hide();
        el.show();
    }

    function activateWorkflow(workflow) {
        const toActivate = currentEl.children(`section[data-workflow='${workflow}']`);
        activateElement(currentEl, toActivate);
        showActiveElement(currentEl, toActivate);
    }

    let currentEl = null;
    window.onpopstate = e => {
        if(e.state !== null && e.state.workflow) {
            activateWorkflow(e.state.workflow);
        }
    }

    window.onhashchange = e => {
        activateWorkflow(location.hash.substring(1));
    }

    $.fn.workflow = function(action) {
        currentEl = this;
        if (action === "next") {
            const nextActive = this.children("section.active").next();
            if(nextActive.length === 0) {
                return false;
            }
            activateElement(this, nextActive);
        } else if(action === "prev") {
            const prevActive = this.children("section.active").prev();
            if(prevActive.length === 0) {
                return false;
            }
            activateElement(this, prevActive);
        }

        const activeSection = this.children("section.active").first();
        showActiveElement(this, activeSection);
        manageHistory(activeSection);
        return this;
    };
})(jQuery);