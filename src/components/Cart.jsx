import React from 'react';

const Cart = ({ items, onClose, onRemove, onUpdateQuantity }) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div style={styles.overlay}>
            <div className="fade-in" style={styles.modal}>
                <div style={styles.header}>
                    <h2>Your Cart ({items.length})</h2>
                    <button style={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div style={styles.items}>
                    {items.length === 0 ? (
                        <div style={styles.empty}>
                            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</span>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} style={styles.item}>
                                <img src={item.image} alt={item.name} style={styles.itemImage} />
                                <div style={styles.itemInfo}>
                                    <h4>{item.name}</h4>
                                    <p>${item.price.toFixed(2)} / {item.unit}</p>
                                </div>
                                <div style={styles.controls}>
                                    <button
                                        style={styles.qtyBtn}
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    >-</button>
                                    <span style={styles.qty}>{item.quantity}</span>
                                    <button
                                        style={styles.qtyBtn}
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    >+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={styles.footer}>
                    <div style={styles.total}>
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button style={styles.checkoutBtn} disabled={items.length === 0}>
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    modal: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--color-surface)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
    },
    header: {
        padding: '1.5rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeBtn: {
        background: 'none',
        fontSize: '2rem',
        lineHeight: 1,
        color: 'var(--color-text-light)',
    },
    items: {
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
    },
    empty: {
        textAlign: 'center',
        color: 'var(--color-text-light)',
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem',
        gap: '1rem',
    },
    itemImage: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        objectFit: 'cover',
    },
    itemInfo: {
        flex: 1,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--color-bg)',
        padding: '4px',
        borderRadius: '20px',
    },
    qtyBtn: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    qty: {
        fontWeight: '600',
        minWidth: '20px',
        textAlign: 'center',
    },
    footer: {
        padding: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
    },
    total: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1rem',
    },
    checkoutBtn: {
        width: '100%',
        padding: '1rem',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        fontSize: '1rem',
        fontWeight: '600',
    }
};

export default Cart;
