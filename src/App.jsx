import './App.css'
import  Carousel  from './components/Carousel'
const images = [
  '/021.jpg',
  '/021.jpg',
  '/021.jpg',
  '/021.jpg',
  '/021.jpg',
  '/021.jpg',
];
function App() {
  return (
    <>
    <header className='hero-container'>
        <Carousel images={images} />
    </header>
    </>
  )
}

export default App
