/*
React-Quill v0.4.1
https://github.com/zenoamaro/react-quill
*/
import Quill from 'quill/core'
import QuillComponent from './component'
import Mixin from './mixin'
import ToolBar from './toolbar'

const Parchment = Quill.import('parchment')
const FontStyle = new Parchment.Attributor.Style('size', 'font-size', { scope: Parchment.Scope.INLINE })
const FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', { scope: Parchment.Scope.INLINE })

Quill.register(FontStyle, true)
Quill.register(FontFamilyStyle, true)

export { Quill, Mixin, ToolBar, QuillComponent as default }
