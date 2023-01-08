// global store
const store = Immutable.Map({
    images: Immutable.List([]),
    landing_date: '',
    launch_date: '',
    status: '',
    max_date: '',
    active_tab: 'tab-1',
    rovers: Immutable.List(['curiosity', 'opportunity', 'spirit']),
    slide_current_index: 0
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {    
    store = store.merge(newState)
    render(root, store)
}

// render page on screen, add event listner
const render = async (root, state) => {
    root.innerHTML = App(state)
    add_tab_listener(state)
    add_slider_listener(state)
}

// create content
const App = (state) => {

    return `
    <header></header>
    <main>

        <div class="container--tabs">
            <h3>Mars Dashboard</h3>
            <p>Please select which rover's information you want to view.</p>

            <section class="row">
                <ul class="nav nav-tabs">
                    <li class="${getActiveClass('tab-1', state)}"><a href="#tab-1">Tab 1</a></li>
                    <li class="${getActiveClass('tab-2', state)}"><a href="#tab-2">Tab 2</a></li>
                    <li class="${getActiveClass('tab-3', state)}"><a href="#tab-3">Tab 3</a></li>
                </ul>
                <div class="tab-content">
                    <div id="tab-1" class="tab-pane ${getActiveClass('tab-1', state)}"> 
                        <span class="glyphicon glyphicon-leaf glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Rover: Curiosity</h3>
                            <p>Launch Date: ${state.get('launch_date')}</p>
                            <p>Landing Date: ${state.get('landing_date')}</p>
                            <p>Status: ${state.get('status')}</p>
                            <p>Most Recent Date photo taken: ${state.get('max_date')}</p>
                        </span>
                    </div> 
                    <div id="tab-2" class="tab-pane ${getActiveClass('tab-2', state)}">
                        <span class="glyphicon glyphicon-fire glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Rover: Opportunity</h3>
                            <p>Launch Date: ${state.get('launch_date')}</p>
                            <p>Landing Date: ${state.get('landing_date')}</p>
                            <p>Status: ${state.get('status')}</p>
                            <p>Most Recent Date photo taken: ${state.get('max_date')}</p>
                        </span>
                    </div>
                    <div id="tab-3" class="tab-pane ${getActiveClass('tab-3', state)}">
                        <span class="glyphicon glyphicon-tint glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Rover: Spirit</h3>
                            <p>Launch Date: ${state.get('launch_date')}</p>
                            <p>Landing Date: ${state.get('landing_date')}</p>
                            <p>Status: ${state.get('status')}</p>
                            <p>Most Recent Date photo taken: ${state.get('max_date')}</p>
                        </span>
                    </div>
                </div>
            </section>
        </div>

        <div class="container--slide">
            <h3>Images</h3>
            <a href="#" class="s-prev" id="s-prev">Prev</a>
            <a href="#" class="s-next" id="s-next">Next</a>
            <div>Total Images: ${state.get('images').toJS().length}, Current Index: ${state.get('slide_current_index')}</div>
            <br>
            <br>
            <div class="single">
            <ul>
                ${getImages(state)}
            </ul>
            </div>
        </div>

    </main>
    <footer></footer>
    `
}

// get rover name based on tab name
const getRoverName = (t) => {
    switch (t){
        case '#tab-1':
            return 'curiosity'
        case '#tab-2':
            return'opportunity'
        case '#tab-3':
            return 'spirit'
    }
}

// dynamic component, return active if the tab name is active
const getActiveClass = (t, state) => {
    return t == state.get('active_tab') ? 'active' : ""
}

// return dynamic html based on the image state
const getImages = (state) => {
    const images = state.get('images').toJS().slice(state.get('slide_current_index'))
    if (images.length == 0){
        return ''
    }

    return images.reduce((acc, v) => {
        const div = `
        <li>
        <div class="single-box">
            <img src="${v.img_src}" alt="${v.id}">
        </div>
        </li>
        `
        return acc + div
    }, '')

}

const add_tab_listener = (state) => {
	// store tabs variable
	const tabs = Immutable.List(Array.from(document.querySelectorAll("ul.nav-tabs > li")));
    
    const tabClick = (clickEvent) => {
        const targetPane = clickEvent.target
        const activePaneId = targetPane.getAttribute('href')

        // reset current image idx, set active tab in store
        const tab_name = activePaneId.substring(1)
        if (state.get('active_tab') != tab_name){
            // get rover name
            const rover = getRoverName(activePaneId)

            // fire api request to retrieve rover data
            queryRoverApi(rover, tab_name)
        }
        
    }

    tabs.map(e => {
        e.addEventListener("click", tabClick)
    })
}

// initial load when page is ready
window.addEventListener('load', ()=>{
    queryRoverApi('curiosity', 'tab-1')
    render(root, store)
})

// api request to retrieve rover data
const queryRoverApi = (rover, tab_name) => {
    fetch(`http://localhost:3000/rovers?rover=${rover}`)
        .then(res => res.json())
        .then(data => {
            data.images = Immutable.List(data.images.photos)
            data.active_tab = tab_name
            data.slide_current_index = 0
            updateStore(store, data)
        })
}

const add_slider_listener = (state) => {
    next = document.getElementById('s-next')
    next.state = state
    prev = document.getElementById('s-prev')
    prev.state = state
  
    next.addEventListener('click', incSlides)
    prev.addEventListener('click', decSlides)
}

// inc slide index by 1
const incSlides = (clickEvent) => {
    const state = clickEvent.currentTarget.state
    sliderToIndex(state.get('slide_current_index') + 1, state)
}

// dec slide index by 1
const decSlides = (clickEvent) => {
    const state = clickEvent.currentTarget.state
    sliderToIndex(state.get('slide_current_index') - 1, state)
}

// Set currentIndex (of the slider) to index
const sliderToIndex = (idx, state) => {
    if (idx < 0){
        idx = 0
    }
    const data = {
        'slide_current_index': idx,
    }
    updateStore(state, data)
  }

