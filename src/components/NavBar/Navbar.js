import React from "react";
import { Link, withRouter } from "react-router-dom";
import icon from './photo.png';
import Button from "@material-ui/core/Button";

// Website NavBar
function Navigation(props) {
  return (
    <div className="navigation">
      <div style={{ opacity:0}} ></div>
      <nav class="py-1 navbar navbar-expand-sm" >
        <div class="container">
          <img src={icon} style={{ height: 40, width: 150, marginTop: '0.5%' }} alt="Logo" />

          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
              <li
                class={`nav-item  ${props.location.pathname === "/" ? "active" : ""
                  }`}
              >
                <Button
                  color="white"
                  //variant="contained"
                  size="small"
                  >
                  <Link class="nav-link" to="/" style={{color:"#fd535b"}}>
                    Home
                    <span class="sr-only">(current)</span>
                  </Link>
                </Button>
              </li>
              <li
                class={`nav-item  ${props.location.pathname === "/feed" ? "active" : ""
                  }`}
              > <Button
                color="white"
                // variant="contained"
                size="small">
                  <Link class="nav-link" to="/feed" style={{color:"#fd535b"}} >
                    Feeds
                  </Link>
                </Button>
              </li>

              <li
                class={`nav-item  ${props.location.pathname === "/premium" ? "active" : ""
                  }`}
              > <Button
                color="white"
                // variant="contained"
                size="small">
                  <Link class="nav-link" to="/premium" style={{color:"#fd535b"}} >
                    Premium
                  </Link>
                </Button>
              </li>

              <li
                class={`nav-item  ${props.location.pathname === "/profile" ? "active" : ""
                  }`}
              >
                <Button
                  color="white"
                  // variant="contained"
                  size="small"
                // fullWidth
                >
                  <Link class="nav-link" to="/profile" style={{color:"#fd535b"}} >
                    My Profile
                  </Link>
                </Button>


              
              </li>
            </ul>
          </div>
        </div>

      </nav>
    </div>
  );
}

export default withRouter(Navigation);