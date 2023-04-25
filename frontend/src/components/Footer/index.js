import React from "react";
import "./index.css";

function Footer() {

    return (
        <footer>
            <div className="footer-links">
                <p>Check out the dev!</p>
                <ul>
                <li><a href="https://github.com/NygilNet" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github fa-2x" style={{color: "#CCCCCC"}} ></i></a></li>
                <li><a href="https://www.linkedin.com/in/nygil-nettles-dev/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin fa-2x" style={{color: "#CCCCCC"}} ></i></a></li>
                <li><a href="https://github.com/NygilNet/you_meet_in_a_tavern" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-book-bookmark fa-2x" style={{color: "#CCCCCC"}} ></i></a></li>
                </ul>
            </div>
            <div className="footer-copyright">
                <p>You Meet In A Tavern is a Meetup clone by Nygil Nettles</p>
                <p>Background image is from Marjan Blan on Unsplash</p>
            </div>
        </footer>
    )


}

export default Footer;
