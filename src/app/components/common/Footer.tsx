const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-4 mt-8 border-t">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} My Blogs All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;