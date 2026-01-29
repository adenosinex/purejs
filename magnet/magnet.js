const { createApp } = Vue;
createApp({
    delimiters: ['${', '}'],
    data() {
        return {
            rawInput: '',
            links: [],
            currentIndex: 0,
            message: '',
            error: ''
        }
    },
    computed: {
        currentLink() {
            return this.links[this.currentIndex] || '';
        }
    },
    methods: {
        parseLinks() {
            this.error = '';
            this.message = '';
            const lines = this.rawInput.split(/\r?\n/).map(l => l.trim()).filter(l => l);
            if (!lines.length) {
                this.error = 'No valid links detected';
                this.links = [];
                this.currentIndex = 0;
                return;
            }
            this.links = lines;
            this.currentIndex = 0;
            this.message = `Parsed ${this.links.length} links, ready`;
        },
        async copyTextToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                // 备用方案
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    return true;
                } catch (e) {
                    document.body.removeChild(ta);
                    return false;
                }
            }
        },
        async nextCopy() {
            this.error = '';
            if (!this.links.length) {
                this.error = 'Please parse input links first';
                return;
            }

            if (this.currentIndex < this.links.length - 1) {
                this.currentIndex++;
                const text = this.currentLink;
                const ok = await this.copyTextToClipboard(text);
                if (ok) {
                    this.message = `Copied: ${text}`;
                    if (this.currentIndex >= this.links.length - 1) this.message += ' — All done';
                } else {
                    this.error = 'Copy failed, please copy manually';
                }
            } else if (this.currentIndex === this.links.length - 1) {
                const text = this.currentLink;
                const ok = await this.copyTextToClipboard(text);
                if (ok) {
                    this.message = `Copied: ${text} — All done`;
                    this.currentIndex = this.links.length;
                } else {
                    this.error = 'Copy failed, please copy manually';
                }
            } else {
                this.message = '已全部复制完成';
            }
        },
        async copyCurrent() {
            this.error = '';
            if (!this.links.length) { this.error = 'No links to copy'; return; }
            const ok = await this.copyTextToClipboard(this.currentLink);
            if (ok) this.message = `Copied: ${this.currentLink}`;
            else this.error = 'Copy failed, please copy manually';
        },
        prev() {
            if (this.currentIndex > 0) this.currentIndex--;
            this.message = '';
        },
        reset() {
            this.rawInput = '';
            this.links = [];
            this.currentIndex = 0;
            this.message = '';
            this.error = '';
        }
    }
}).mount('#app');