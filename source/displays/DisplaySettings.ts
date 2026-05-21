/**
 * DisplaySettings — global singleton for runtime rendering settings.
 *
 * Adding a new setting:
 *   1. Add a private backing field and public getter/setter below.
 *   2. Call this.emit() in the setter so listeners are notified.
 *   3. Read `displaySettings.<yourSetting>` inside drawLandmarks / render calls.
 *   4. Add a UI widget in initSettingsUI() — it will auto-connect via the setter.
 */

export type SettingKey = 'dotSize' | 'showDots' | 'showLines' | 'connectionDotsCount' | 'opacity'

export type SettingValue = number | boolean | string

export type SettingsListener = (key: SettingKey, value: SettingValue) => void

class DisplaySettings {
    // ── Settings ──────────────────────────────────────────────────────────────

    private _dotSize: number = 4
    private _showDots: boolean = true
    private _showLines: boolean = false
    private _connectionDotsCount: number = 0
    private _opacity: number = 1.0

    get dotSize(): number { return this._dotSize; }
    set dotSize(v: number) {
        this._dotSize = Math.max(0.5, v)
        this.emit('dotSize', this._dotSize)
    }

    get showDots(): boolean { return this._showDots; }
    set showDots(v: boolean) {
        this._showDots = v
        this.emit('showDots', this._showDots)
    }

    get showLines(): boolean { return this._showLines; }
    set showLines(v: boolean) {
        this._showLines = v
        this.emit('showLines', this._showLines)
    }

    get connectionDotsCount(): number { return this._connectionDotsCount; }
    set connectionDotsCount(v: number) {
        this._connectionDotsCount = Math.floor(v)
        this.emit('connectionDotsCount', this._connectionDotsCount)
    }

    get opacity(): number { return this._opacity; }
    set opacity(v: number) {
        this._opacity = Math.max(0, Math.min(1, v))
        this.emit('opacity', this._opacity)
    }

    // ── Observer ──────────────────────────────────────────────────────────────

    private listeners: SettingsListener[] = []

    onChange(fn: SettingsListener): () => void {
        this.listeners.push(fn)
        return () => { this.listeners = this.listeners.filter(l => l !== fn); }
    }

    private emit(key: SettingKey, value: SettingValue): void {
        for (const fn of this.listeners) fn(key, value)
    }

    // ── Persistence ───────────────────────────────────────────────────────────

    load(): void {
        if (typeof window === 'undefined' || !window.localStorage) return
        try {
            const raw = localStorage.getItem('displaySettings')
            if (!raw) return
            const saved = JSON.parse(raw)
            if (typeof saved.dotSize === 'number') this._dotSize = saved.dotSize
            if (typeof saved.showDots === 'boolean') this._showDots = saved.showDots
            if (typeof saved.showLines === 'boolean') this._showLines = saved.showLines
            if (typeof saved.connectionDotsCount === 'number') this._connectionDotsCount = saved.connectionDotsCount
            if (typeof saved.opacity === 'number') this._opacity = saved.opacity
        } catch { /* ignore */ }
    }

    save(): void {
        if (typeof window === 'undefined' || !window.localStorage) return
        try {
            localStorage.setItem('displaySettings', JSON.stringify({
                dotSize: this._dotSize,
                showDots: this._showDots,
                showLines: this._showLines,
                connectionDotsCount: this._connectionDotsCount,
                opacity: this._opacity
            }))
        } catch { /* ignore */ }
    }

    // ── UI bootstrapper ───────────────────────────────────────────────────────

    /**
     * Builds the settings panel inside `container` and binds all widgets.
     * Safe to call any time after the DOM is ready.
     */
    initUI(container: HTMLElement): void {
        if (typeof document === 'undefined') return
        container.innerHTML = ''; // clear any placeholder

        // ── Show Dots ──
        container.appendChild(this.makeToggle({
            label: 'Show Dots',
            id: 'setting-show-dots',
            value: this._showDots,
            onChange: (v) => { this.showDots = v; this.save(); },
        }))

        // ── Show Lines ──
        container.appendChild(this.makeToggle({
            label: 'Show Lines',
            id: 'setting-show-lines',
            value: this._showLines,
            onChange: (v) => { this.showLines = v; this.save(); },
        }))

        // ── Connection Dots ──
        container.appendChild(this.makeSlider({
            label: 'Connection Dots',
            id: 'setting-connection-dots',
            min: 0, max: 10, step: 1,
            value: this._connectionDotsCount,
            format: (v) => `${v}`,
            onChange: (v) => { this.connectionDotsCount = v; this.save(); },
        }))

        // ── Dot Size ──
        container.appendChild(this.makeSlider({
            label: 'Dot Size',
            id: 'setting-dot-size',
            min: 0.5, max: 20, step: 0.5,
            value: this._dotSize,
            format: (v) => `${v}px`,
            onChange: (v) => { this.dotSize = v; this.save(); },
        }))

        // ── Opacity ──
        container.appendChild(this.makeSlider({
            label: 'Opacity',
            id: 'setting-opacity',
            min: 0, max: 1, step: 0.1,
            value: this._opacity,
            format: (v) => `${Math.round(v * 100)}%`,
            onChange: (v) => { this.opacity = v; this.save(); },
        }))
    }

    // ── Widget factory ────────────────────────────────────────────────────────

    private makeToggle(opts: {
        label: string
        id: string
        value: boolean
        onChange: (v: boolean) => void
    }): HTMLElement {
        const wrap = document.createElement('div')
        wrap.className = 'setting-row'

        const labelEl = document.createElement('label')
        labelEl.htmlFor = opts.id
        labelEl.textContent = opts.label

        const toggle = document.createElement('input')
        toggle.type = 'checkbox'
        toggle.id = opts.id
        toggle.checked = opts.value

        toggle.addEventListener('change', () => {
            opts.onChange(toggle.checked)
        })

        wrap.appendChild(labelEl)
        wrap.appendChild(toggle)
        return wrap
    }

    private makeSlider(opts: {
        label: string
        id: string
        min: number; max: number; step: number; value: number
        format: (v: number) => string
        onChange: (v: number) => void
    }): HTMLElement {
        const wrap = document.createElement('div')
        wrap.className = 'setting-row'

        const labelEl = document.createElement('label')
        labelEl.htmlFor = opts.id
        labelEl.textContent = opts.label

        const valueEl = document.createElement('span')
        valueEl.className = 'setting-value'
        valueEl.textContent = opts.format(opts.value)

        const slider = document.createElement('input')
        slider.type = 'range'
        slider.id = opts.id
        slider.min = String(opts.min)
        slider.max = String(opts.max)
        slider.step = String(opts.step)
        slider.value = String(opts.value)

        slider.addEventListener('input', () => {
            const v = parseFloat(slider.value)
            valueEl.textContent = opts.format(v)
            opts.onChange(v)
        })

        wrap.appendChild(labelEl)
        wrap.appendChild(slider)
        wrap.appendChild(valueEl)
        return wrap
    }
}

export const displaySettings = new DisplaySettings()
displaySettings.load()

export const updateDisplaySettings = (updates: Partial<Record<SettingKey, SettingValue>>): DisplaySettings => {
    for (const [key, value] of Object.entries(updates) as [SettingKey, SettingValue][]) {
        if (key in displaySettings) {
            (displaySettings as any)[key] = value
        }
    }
    displaySettings.save()
    return displaySettings
}

export const getDisplaySettings = (): DisplaySettings => displaySettings
