
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

        <h3>Mars Dashboard</h3>
        <p>You are going to create a dashboard that consumes the NASA API. Your dashboard will allow the user to select which rover's information they want to view. Once they have selected a rover, they will be able to see the most recent images taken by that rover, as well as important information about the rover and its mission. Your app will make use of all the functional concepts and practices you have learned in this course, and the goal is that you would become very comfortable using pure functions and iterating over, reshaping, and accessing information from complex API responses.</p>

        <div class="container--tabs">
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

const getActiveClass = (t, state) => {
    if (t == state.get('active_tab')){
        return 'active'
    }else{
        return ''
    }
}

const getImages = (state) => {
    const images = state.get('images').toJS().slice(state.get('slide_current_index'))
    if (images.length == 0){
        return ''
    }
    const htmls =  images.reduce((acc, v) => {
        const div = `
        <li>
        <div class="single-box">
            <img src="${v.img_src}" alt="${v.id}">
        </div>
        </li>
        `
        return acc + div
    }, '')

    return htmls
}

const add_tab_listener = (state) => {
	// store tabs variable
	const tabs = Array.from(document.querySelectorAll("ul.nav-tabs > li"));
    
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

window.addEventListener('load', ()=>{
    queryRoverApi('curiosity', 'tab-1')
    render(root, store)
})


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

const incSlides = (clickEvent) => {
    const state = clickEvent.currentTarget.state
    sliderToIndex(state.get('slide_current_index') + 1, state)
}

const decSlides = (clickEvent) => {
    const state = clickEvent.currentTarget.state
    sliderToIndex(state.get('slide_current_index') - 1, state)
}

// Set currentIndex (of the slider) to index and update styles
const sliderToIndex = (idx, state) => {
    if (idx < 0){
        idx = 0
    }
    const data = {
        'slide_current_index': idx,
    }
    updateStore(state, data)
  }

