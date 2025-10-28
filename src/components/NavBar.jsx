import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import './NavBar.css'

import logoExtend from '/logo-extend.png' 

function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])


    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    return (
        <header>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className={`nav-logo ${isScrolled ? 'scrolled' : ''}`}>
                    <img src={logoExtend} alt="Moryver Logo" />
                </div>
                <ul className="nav-links">
                    <li><Link to="/">INICIO</Link></li>
                    <li><Link to="/map">MAPA</Link></li>
                    <li><a className="contact" href="#contact">INICIAR SESIÓN</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default NavBar

