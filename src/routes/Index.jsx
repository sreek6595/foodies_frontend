import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from '../pages/Homepage'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Restaurantpage from '../pages/Restaurantpage'
import Adminpage from '../pages/Adminpage'
import Customerpage from '../pages/Customerpage'
import Regis from '../pages/Regis'
import Addmenupage from '../pages/Addmenupage'
import Incomingpage from '../pages/Incomingpage'
import Viewpaypage from '../pages/Viewpaypage'
import Viewreviewpage from '../pages/Viewreviewpage'
import Cpage from '../pages/Cpage'
import Restaurantviewpage from '../pages/Restaurantviewpage'
import Viewfoodmenupage from '../pages/Viewfoodmenupage'
import Addcartpage from '../pages/Addcartpage'
import Viewcartpage from '../pages/Viewcartpage'
import Ordertrackpage from '../pages/Ordertrackpage'
import Paymentpage from '../pages/Paymentpage'
import Feedbackpage from '../pages/Feedbackpage'
import Deliverypage from '../pages/Deliverypage'
import Viewfeeddbpage from '../pages/Viewfeeddbpage'
import Orderlistdbpage from '../pages/Orderlistdbpage'
import Dbregistrationpage from '../pages/Dbregistrationpage'
import Complaintpage from '../pages/Complaintpage'
import Customerprofilepage from '../pages/Customerprofilepage'
import Dbprofilepage from '../pages/Dbprofilepage'
import Restaurantprofilepage from '../pages/Restaurantprofilepage'
import Dboyhomepage from '../pages/Dboyhomepage'
import Adminresverifypage from '../pages/Adminresverifypage'
import Customerregispage from '../pages/Customerregispage'
import Admincustviewpage from '../pages/Admincustviewpage'
import Adminrestviewpage from '../pages/Adminrestviewpage'
import Admindbviewpage from '../pages/Admindbviewpage'
import Restaurantnotifypage from '../pages/Restaurantnotifypage'
import Customernotifypage from '../pages/Customernotifypage'
import Viewadfoodpage from '../pages/Viewadfoodpage'
import Viewrestbyropage from '../pages/Viewrestbyropage'
import Viewfoodropage from '../pages/Viewfoodropage'
import Foodlistviewpage from '../pages/Foodlistviewpage'
import Viewfoodcustpage from '../pages/Viewfoodcustpage'
import Cartopage from '../pages/Cartopage'
import DriverLocation from '../components/DriverLocation'
import Resetpasswordpage from '../pages/Resetpasswordpage'
import Deliverynopage from '../pages/Deliverynopage'
import Paystatusadpage from '../pages/Paystatusadpage'
import Menu from '../components/Menu'
import Complaintdbpage from '../pages/Complaintdbpage'
import Adminnotifypage from '../pages/Adminnotifypage'
// import { Menu } from 'lucide-react'

function Index() {
  return (
    <BrowserRouter>
    <Routes>
      
        <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/restaurantreg' element={<Restaurantpage/>}/>
        <Route path='/admin' element={<Adminpage/>}/>
        <Route path='/customer' element={<Customerpage/>}/>
        <Route path='/regis' element={<Regis/>}/>
        <Route path='/addmenu' element={<Addmenupage/>}/>
        <Route path='/incoming' element={<Incomingpage/>}/>
        <Route path='/viewpay' element={<Viewpaypage/>}/>
        <Route path='/viewreview' element={<Viewreviewpage/>}/>

        <Route path='/customerp' element={<Cpage/>}/>
        <Route path='/restaurantview' element={<Restaurantviewpage/>}/>
        <Route path='/foodmenuview' element={<Viewfoodmenupage/>}/>
        <Route path='/addcart' element={<Addcartpage/>}/>
        <Route path='/viewcart' element={<Viewcartpage/>}/>
        <Route path='/order' element={<Complaintpage/>}/>
        
        <Route path='/ordert/:id' element={<Ordertrackpage/>}/>
        <Route path='/payment/:id' element={<Paymentpage/>}/>=
        <Route path='/feedback' element={<Feedbackpage/>}/>

        <Route path='/delivery' element={<Deliverypage/>}/>
        <Route path='/location' element={<DriverLocation/>}/>
        <Route path='/viewfeeddb' element={<Viewfeeddbpage/>}/>
        <Route path='/vieworderlist' element={<Orderlistdbpage/>}/>
        
        <Route path='/dboyregis' element={<Dbregistrationpage/>}/>
        <Route path='/custregis' element={<Customerregispage/>}/>

        {/* //profile */}
        <Route path='/customerprofile' element={<Customerprofilepage/>}/>
        <Route path='/dbprofile' element={<Dbprofilepage/>}/>
        <Route path='/resprofile' element={<Restaurantprofilepage/>}/>

        {/* homepage */}
        <Route path='/dboyhome' element={<Dboyhomepage/>}/>

        {/* admin */}
        <Route path='/adminverifyres' element={<Adminresverifypage/>}/>
        <Route path='/admincustview' element={<Admincustviewpage/>}/>
        <Route path='/adminrestview' element={<Adminrestviewpage/>}/>
        <Route path='/admindbview' element={<Admindbviewpage/>}/>

        {/* notification */}
        <Route path='/restnotify' element={<Restaurantnotifypage/>}/>
        <Route path='/custnotify' element={<Customernotifypage/>}/>

        {/* view */} 
        <Route path='/viewadfood' element={<Viewadfoodpage/>}/>
        <Route path='/viewrestro' element={<Viewrestbyropage/>}/>
        <Route path='/burger' element={<Viewfoodropage/>}/>
        <Route path='/viewfoodlist' element={<Foodlistviewpage/>}/>


        <Route path='/viewfoodcust/:id' element={<Viewfoodcustpage/>}/>
<Route path='/carto' element={<Cartopage/>}/>

<Route path='/reset-password' element={<Resetpasswordpage/>}/>

<Route path='/deliverynot' element={<Deliverynopage/>}/>

<Route path='/paystatus' element={<Paystatusadpage/>}/>

<Route path="/menu" element={<Menu />} />
<Route path="/complaintdb/:id" element={<Complaintdbpage/>}/>

<Route path='/adminnot' element={<Adminnotifypage/>}/>



    </Routes>
    </BrowserRouter>
  )
}

export default Index