import React from 'react';

const ProductCard = ({ product, onAdd }) => {
    return (
        <div className="fade-in" style={styles.card}>
            <div style={styles.imageContainer}>
                <img src={product.image} alt={product.name} style={styles.image} />
                <span style={styles.category}>{product.category}</span>
            </div>
            <div style={styles.content}>
                <h3 style={styles.title}>{product.name}</h3>
                <p style={styles.unit}>{product.unit}</p>
                <div style={styles.footer}>
                    <span style={styles.price}>${product.price.toFixed(2)}</span>
                    <button style={styles.addBtn} onClick={() => onAdd(product)}>
                        Add +
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
    },
    imageContainer: {
        position: 'relative',
        paddingTop: '75%', // 4:3 Aspect Ratio
        backgroundColor: '#f1f1f1',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    category: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'var(--color-text-light)',
        backdropFilter: 'blur(4px)',
    },
    content: {
        padding: '1rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.25rem',
        color: 'var(--color-text)',
    },
    unit: {
        fontSize: '0.875rem',
        color: 'var(--color-text-light)',
        marginBottom: '1rem',
    },
    footer: {
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '1.125rem',
        fontWeight: '700',
        color: 'var(--color-primary-dark)',
    },
    addBtn: {
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '0.875rem',
    }
};

export default ProductCard;
