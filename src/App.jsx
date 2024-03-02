import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Pages
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Test = React.lazy(() => import("./pages/test"));
const Test_backup = React.lazy(() => import("./pages/test_backup"));
const Search = React.lazy(() => import("./pages/Search"));



const Sell_rent = React.lazy(() => import("./pages/Sell_rent"));

const CreateAblog = React.lazy(() => import("./pages/createAblog"));
const EditBlog = React.lazy(() => import("./pages/editBlog"));
const BlogHome = React.lazy(() => import("./pages/blogHomepage"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const MyBlogs = React.lazy(() => import("./pages/myBlogs"));
const PropertyDetails = React.lazy(() => import("./pages/PropertyDetails"));
const Message =React.lazy(()=>import ("./pages/message"));
const Inbox =React.lazy(()=>import ("./pages/inbox"));


//const BlogPage = React.lazy(() => import("./pages/BlogPage"));

const SearchResults = React.lazy(() => import("./pages/SearchResults"));

//Components
const Header = React.lazy(() => import("./components/Header"));
const LandingPageHeader = React.lazy(() =>
  import("./components/LandingPageHeader")
);
const PrivateRoute = React.lazy(() => import("./components/PrivateRoute"));

export default function App() {
  //check if user is logged in. We have used authenticaion token to check if user is logged in or not
  //if user is logged in then return true else false
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    //check if token is expired
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.exp * 1000 > Date.now();
    }
    return false;
  };

  return (
    //isLoggedIn={isLoggedIn}
    <React.Suspense fallback={<>Loading...</>}>
      <BrowserRouter>
        <LandingPageHeader />
        <Routes>
          <Route path="/message" element={<Message/>} />
          <Route path="/inbox" element={<Inbox/>} />

          <Route path="/blogHome/:id" element={<BlogDetail />} />
          <Route path="/blogHome" element={<BlogHome />} />
          <Route path="/createblog" element={<CreateAblog />} />
          <Route path="/myblogs/editBlog/:id" element={<EditBlog />} />
          <Route path="/search-results/:id" element={<PropertyDetails />} />
          <Route path="/myblogs" element={<MyBlogs />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test-backup" element={<Test_backup />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/sell_rent" element={<Sell_rent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
} // Merge test
