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
                this.error = '未检测到有效链接';
                this.links = [];
                this.currentIndex = 0;
                return;
            }
            this.links = lines;
            this.currentIndex = 0;
            this.message = `共解析 ${this.links.length} 条链接，准备就绪`;
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
                this.error = '请先解析输入的链接';
                return;
            }

            if (this.currentIndex < this.links.length - 1) {
                this.currentIndex++;
                const text = this.currentLink;
                const ok = await this.copyTextToClipboard(text);
                if (ok) {
                    this.message = `已复制：${text}`;
                    if (this.currentIndex >= this.links.length - 1) this.message += ' — 已全部完成';
                } else {
                    this.error = '复制失败，请手动复制';
                }
            } else if (this.currentIndex === this.links.length - 1) {
                const text = this.currentLink;
                const ok = await this.copyTextToClipboard(text);
                if (ok) {
                    this.message = `已复制：${text} — 已全部完成`;
                    this.currentIndex = this.links.length;
                } else {
                    this.error = '复制失败，请手动复制';
                }
            } else {
                this.message = '已全部复制完成';
            }
        },
        async copyCurrent() {
            this.error = '';
            if (!this.links.length) { this.error = '无可复制的链接'; return; }
            const ok = await this.copyTextToClipboard(this.currentLink);
            if (ok) this.message = `已复制：${this.currentLink}`;
            else this.error = '复制失败，请手动复制';
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