// - BeerApp
// - bool ? BrewerysList : BrewerySeach


// if showBeer clicked
//    displayBeer
// else
//    display FindBeer

class BeerApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showBeerResults: false
    };
  }

  componentWillMount() {
    // Invoked once, both on the client and server, immediately before the initial rendering occurs.
    this._nearMe();
  }

  _getLocation() {
    this.setState({ showBeerResults: true});

    if('geolocation' in navigator) {
      requestLocation();
    } else {
      console.log("Browser doesn't support geolocation");
    }

    function requestLocation() {

      var options = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0};

      navigator.geolocation.getCurrentPosition(success, error, options);

      function success(pos) {
        var long = pos.coords.longitude;
        var lat = pos.coords.latitude;

        getBreweryFromLatLong(lat, long).then(function(json) {
          console.log(json);
        });

        console.log("long", long, "Lat", lat);
      }
      var error = err => console.log(err);
    }
  }


  _nearMe() {
    // call geo location
  }

  render() {
    //  { this.state.showResults ? <Results /> : null }
    return (
      <div className="container">
          <div className="row">
              <div className="col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6">
                  <BreweryListView/>
              </div>
          </div>
      </div>
    )
  }
}



class BreweryListView extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      brewerys: []
    };
  }

  componentWillMount() {
    // Invoked once, both on the client and server, immediately before the initial rendering occurs.
    this._fetchBrewerysByLocation();
  }

  render() {
    const brewerysComponents = this._createBreweryComponents();

    return (
        <div>
          <h1 className="text-center">Local Brewerys</h1>
          <div className="breweryList list-group text-center well">
            {brewerysComponents}
          </div>
        </div>
      )
  }

  _fetchBrewerysByLocation() {
    $.ajax({
      url: '/api/comments',
      dataType: 'json',
      cache: false,
      success: (Data) => {
        this.setState({
          brewerys: Data.data
        });
      },
      error: err => console.log(err.toString())
    });
  }

  _createBreweryComponents() {
    //var brewerysNameList = this.state.brewerys.filter(beer => beer.brewery.images)//.map(beer => [beer.brewery.name, beer.streetAddress, beer.postalCode]);
    //var beer = this.state.brewerys[3];

    //console.log(beer.brewery);

    // if(b.brewery.images) { brewery.icon = b.brewery.images.icon; }
    var icons = this.state.brewerys.filter(beer => beer.brewery.images);
    console.log(icons.map(beer => beer.brewery.images.icon).length)
    return this.state.brewerys.filter(beer => beer.streetAddress && beer.openToPublic == "Y" && beer.locationType != "office" && beer.brewery.images).map(beer => {
      return <BreweryItem
        key={Math.random()}
        name={beer.brewery.name}
        address={beer.streetAddress}
        zipcode={beer.postalCode}
        distance={beer.distance}
        type={beer.locationType}
        icon={beer.brewery.images.icon}
      />
    });
  }
}

class BreweryItem extends React.Component {
  render() {
    return (

           <a  className="list-group-item">

              <span className="pull-left">
                <img  src={this.props.icon} alt="..."/>
              </span>

              <h4 className="list-group-item-heading">{this.props.name}</h4>
              <p className="list-group-item-text">{this.props.type}</p>
              <p className="list-group-item-text">{this.props.address + ', ' + this.props.zipcode }</p>
              <p className="list-group-item-text">{`${this.props.distance} miles away`}</p>
           </a>

      )
  }
}

class BrewerySearchView extends BeerApp {
  render() {
    return (
      <div>Near Me</div>
      )
  }
}




ReactDOM.render( < BeerApp / > , document.getElementById('app'));
