import { useDispatch, useSelector } from "react-redux";
import { UserDropdown } from "../components/Dropdown";
import { Link } from "react-router-dom";
import { userLogoutAction } from "../Redux/Actions/User";
import { LiaShoppingBagSolid } from "react-icons/lia";
import Checkout from "../pages/Checkout";
import { useState, useEffect } from "react";
import { fetchCartItemsAction } from "../Redux/Actions/Cart"; 

const Navbar = () => {
  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;
  const dispatch = useDispatch();

  const qty = useSelector((state) => state.cartReducer.cartItems.reduce((total, item) => total + item.qty, 0));

  const logoutHandler = () => {
    dispatch(userLogoutAction());
  };

  const [open, setOpen] = useState(false);

  // Load the cart when the component mounts
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCartItemsAction(userInfo._id)); // Fetch cart items for the logged-in user
    }
  }, [dispatch, userInfo]);

  return (
    <nav className="bg-white border-b">
    <div className="mx-auto px-4 lg:px-32">
      <div className="flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            {/* <img
              src="https://www.svgrepo.com/show/520948/shopping-bag-4.svg"
              className="h-8 w-8 mr-2"
              alt="PRIMETIME Shop Logo"
            /> */}
            <span className="text-xl font-bold text-gray-900">Primetime <span className="font-light">Store</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {!userInfo ? (
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 underline hover:bg-opacity-90"
            >
              Login
            </Link>
          ) : (
            <>
              <button
                className="relative inline-flex items-center p-2 text-sm font-medium text-center text-gray-900"
                onClick={() => setOpen(true)}
              >
                <LiaShoppingBagSolid size={24} />
                {qty > 0 && (
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2">
                    {qty}
                  </div>
                )}
              </button>
              <UserDropdown className="text-gray-900" logoutHandler={logoutHandler} />
              <Checkout open={open} setOpen={setOpen} />
            </>
          )}
        </div>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
