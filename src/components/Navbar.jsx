import React from 'react';

const Navbar = ({ cartCount, onCartClick }) => {
    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <div style={styles.logo}>
                    <span style={{ color: 'var(--color-primary)' }}>Fresh</span>Market
                </div>

                <button style={styles.cartBtn} onClick={onCartClick}>
                    🛒
                    {cartCount > 0 && (
                        <span style={styles.badge}>{cartCount}</span>
                    )}
                </button>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--color-text)',
        letterSpacing: '-0.5px',
    },
    cartBtn: {
        backgroundColor: 'transparent',
        fontSize: '1.5rem',
        position: 'relative',
        padding: '0.5rem',
    },
    badge: {
        position: 'absolute',
        top: '0',
        right: '0',
        backgroundColor: 'var(--color-secondary)',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--color-surface)',
    }
};

export default Navbar;
