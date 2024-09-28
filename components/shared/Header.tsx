'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; 

const Header = () => {
  const router = useRouter(); 

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">

        

        {/* Call to Action */}
        <div className="flex items-center space-x-4">
          <Button variant="default" className="bg-white text-blue-600" onClick={() => router.push('/book')}>
            Book Event
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
