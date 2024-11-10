'use client'


import Heading from "./Heading"; 
import { allPath } from "./../utils/path"; 
import { usePathname } from "next/navigation";

export default function RenderHeadings() {
    const currentPath = usePathname(); 
    return (
      <div>
        {allPath.map((group) => (
          <div key={group.name}>
            {group.data.map((page) => {
                let modifiedPagePath = page.path.replace('..','')
              if (modifiedPagePath === currentPath) {
                return (
                <>

                <Heading 
                    key={page.name} 
                    title={page.name} 
                    subtitle={group.name} 
                  />
                </>
                  
                );
              }
              return null; 
            })}
          </div>
        ))}
      </div>
    );
  };


