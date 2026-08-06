<script lang="ts" setup>
const currentYear = new Date().getFullYear()
</script>

<template>
    <footer class="footer">
        <div class="footer-line"></div>
        <div class="footer-MoeIcp">
        </div>
        <div class="footer-bottom">
            <p>&copy;2020-{{ currentYear }} Kecare. All rights reserved.</p>
            <p>Powered by <a href="https://kecare.kecream.cn" target="_blank" rel="noopener noreferrer">Kecare</a></p>
        </div>
        <div class="footer-line">
        </div>
    </footer>
</template>

<style scoped>
.footer {
    width: 100%;
    background: var(--color-bg-primary);
    margin-top: auto;
}

.footer-line {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-accent, #87ceeb), transparent);
}

.footer-bottom {
    margin: 0 auto;
    padding: 20px 40px;
    text-align: center;
    gap: 10px;
    flex-wrap: wrap;
}

.footer-MoeIcp {
    margin-top: 20px;
    text-align: center;
    border: none;
}

.footer-MoeIcp a {
    text-decoration: none;
}

.footer-bottom p {
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    margin: 0;
}

.footer-bottom a {
    color: var(--color-accent, #87ceeb);
    text-decoration: none;
    transition: opacity 0.2s ease;
}

.footer-bottom a:hover {
    opacity: 0.8;
}
</style>
