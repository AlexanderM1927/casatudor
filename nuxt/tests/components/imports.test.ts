import { describe, test, expect } from 'vitest'

describe('import vue components', () => {
    test('normal imports as expected', async () => {
        const component = await import('../components/TheHeader.vue')
        expect(component).toBeDefined()
    })
})