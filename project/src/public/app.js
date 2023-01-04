let store = {
    images: [],
    landing_date: '',
    launch_date: '',
    status: '',
    max_date: '',
    active_tab: 'tab-1',
    rovers: ['curiosity', 'opportunity', 'spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {    
    store = Object.assign(store, newState)
    render(root, store)
    console.log(store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
    add_tab_listener()
}

// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
    <header></header>
    <main>

        <h3>Mars Dashboard</h3>
        <p>You are going to create a dashboard that consumes the NASA API. Your dashboard will allow the user to select which rover's information they want to view. Once they have selected a rover, they will be able to see the most recent images taken by that rover, as well as important information about the rover and its mission. Your app will make use of all the functional concepts and practices you have learned in this course, and the goal is that you would become very comfortable using pure functions and iterating over, reshaping, and accessing information from complex API responses.</p>

        <div class="container--tabs">
            <section class="row">
                <ul class="nav nav-tabs">
                    <li class="${getActiveClass('tab-1')}"><a href="#tab-1">Tab 1</a></li>
                    <li class="${getActiveClass('tab-2')}"><a href="#tab-2">Tab 2</a></li>
                    <li class="${getActiveClass('tab-3')}"><a href="#tab-3">Tab 3</a></li>
                </ul>
                <div class="tab-content">
                    <div id="tab-1" class="tab-pane ${getActiveClass('tab-1')}"> 
                        <span class="glyphicon glyphicon-leaf glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Rover: Curiosity</h3>
                            <p>Launch Date: ${store.launch_date}</p>
                            <p>Landing Date: ${store.landing_date}</p>
                            <p>Status: ${store.status}</p>
                            <p>Most Recent Date photo taken: ${store.max_date}</p>
                        </span>
                    </div> 
                    <div id="tab-2" class="tab-pane ${getActiveClass('tab-2')}">
                        <span class="glyphicon glyphicon-fire glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Rover: Opportunity</h3>
                            <p>Launch Date: ${store.launch_date}</p>
                            <p>Landing Date: ${store.landing_date}</p>
                            <p>Status: ${store.status}</p>
                            <p>Most Recent Date photo taken: ${store.max_date}</p>
                        </span>
                    </div>
                    <div id="tab-3" class="tab-pane ${getActiveClass('tab-3')}">
                        <span class="glyphicon glyphicon-tint glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Rover: Spirit</h3>
                            <p>Launch Date: ${store.launch_date}</p>
                            <p>Landing Date: ${store.landing_date}</p>
                            <p>Status: ${store.status}</p>
                            <p>Most Recent Date photo taken: ${store.max_date}</p>
                        </span>
                    </div>
                </div>
            </section>
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

const getActiveClass = (t) => {
    if (t == store.active_tab){
        return 'active'
    }else{
        return ''
    }
}

const add_tab_listener = () => {
	// store tabs variable
	const tabs = Array.from(document.querySelectorAll("ul.nav-tabs > li"));
    
    const tabClick = (clickEvent) => {
        const targetPane = clickEvent.target
        const activePaneId = targetPane.getAttribute('href')

        // set active tab in store
        store.active_tab = activePaneId.substring(1)

        // get rover name
        const rover = getRoverName(activePaneId)

        // fire api request to retrieve rover data
        queryRoverApi(rover)

    }

    tabs.map(e => {
        e.addEventListener("click", tabClick)
    })
}

window.addEventListener('load', ()=>{
    queryRoverApi('curiosity')
    render(root, store)
})

const getRover = (rover) => {

    return ''
} 

const queryRoverApi = (rover) => {
    fetch(`https://renshou753-super-space-parakeet-57rjq74ppgh47pw-3000.preview.app.github.dev/rovers?rover=${rover}`)
        .then(res => res.json())
        .then(data => {
            updateStore(store, data)
        })
}