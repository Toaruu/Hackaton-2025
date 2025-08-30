import React from 'react'
import "./footer.css"
import "../../app.css"

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer__container container">
            <a href="#top" className="footer__cta">
            <span className="footer__cta-icon">↑</span>
            Back to top
            </a>
        </div>
    </footer>
  )
}

export default Footer