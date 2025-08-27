"use client";
import {useState, useEffect} from 'react';
import {getData} from "@/src/app/components/getData";
import yaml from "@/src/app/components/config-knowledgebases.yaml";
import SideBarKBFromConfig from "@/src/app/components/SideBarKBFromConfig";
import CommunityMembersList from '@/src/app/resources/components/CommunityManager';
import { fetchCommunityMembers } from '@/src/app/resources/lib/data';
import { CommunityMember } from '@/src/app/resources/lib/types';


const ITEMS_PER_PAGE = 50;

const Resources = (
) => {
   const aa = 2;
   const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
   const [categories, setCategories] = useState<string[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

    useEffect(() => {
     async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCommunityMembers();
        setCommunityMembers(data.members);
        setCategories(data.categories);
      } catch (err) {
       setError('Failed to load community members');
       console.error('Error loading data:', err);
      } finally {
       setLoading(false);
      }
  }
    loadData();
    }, []);

   return (
    <div className="main-holder-brainkb">
    <div className="pt-32 sm:pt-40 md:pt-48">
       <h1> Resource aa={aa} </h1>
       <CommunityMembersList materials={communityMembers} />
        </div>
        </div>
       )

};

export default Resources;

