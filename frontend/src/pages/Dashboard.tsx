import { useState, useEffect } from 'react';
import { EventService } from '../services/EventServices';
import { EventRegistrationService } from '../services/EventRegistrationService';
import type { Event } from '../types/Event';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalRegistrations: number;
  myRegistrations: number;
  popularEvents: Event[];
  recentEvents: Event[];
  categoryBreakdown: { [key: string]: number };
  monthlyEventsData: { month: string; count: number }[];
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    totalRegistrations: 0,
    myRegistrations: 0,
    popularEvents: [],
    recentEvents: [],
    categoryBreakdown: {},
    monthlyEventsData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const events = await EventService.getEvents();
      
      // Calculate basic stats
      const now = new Date();
      const upcomingEvents = events.filter(event => new Date(event.date) > now);
      const pastEvents = events.filter(event => new Date(event.date) <= now);
      
      // Get user registrations if authenticated
      let myRegistrations: Event[] = [];
      if (isAuthenticated) {
        try {
          myRegistrations = await EventRegistrationService.getMyRegistrations();
        } catch (error) {
          console.error('Error fetching user registrations:', error);
        }
      }

      // Get registration counts for all events
      const eventsWithCounts = await Promise.all(
        events.map(async (event) => {
          try {
            const countResult = await EventRegistrationService.getRegistrationCount(event.id!);
            return { ...event, registrationCount: countResult.count };
          } catch (error) {
            return { ...event, registrationCount: 0 };
          }
        })
      );

      // Calculate total registrations
      const totalRegistrations = eventsWithCounts.reduce(
        (sum, event) => sum + (event.registrationCount || 0), 0
      );

      // Get popular events (top 5 by registration count)
      const popularEvents = eventsWithCounts
        .sort((a, b) => (b.registrationCount || 0) - (a.registrationCount || 0))
        .slice(0, 5);

      // Get recent events (last 5 created)
      const recentEvents = events
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      // Category breakdown
      const categoryBreakdown: { [key: string]: number } = {};
      events.forEach(event => {
        categoryBreakdown[event.category] = (categoryBreakdown[event.category] || 0) + 1;
      });

      // Monthly events data (last 6 months)
      const monthlyEventsData = generateMonthlyData(events);

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        totalRegistrations,
        myRegistrations: myRegistrations.length,
        popularEvents,
        recentEvents,
        categoryBreakdown,
        monthlyEventsData
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonthlyData = (events: Event[]) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const eventsInMonth = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      }).length;
      
      months.push({ month: monthName, count: eventsInMonth });
    }
    
    return months;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAuthenticated ? `Welcome back, ${user?.fullName || 'User'}!` : 'Dashboard'}
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of the Event Central platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9H4V7z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.upcomingEvents}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 11-4 0 2 2 0 014 0zM12 8a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Registrations</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.totalRegistrations}</dd>
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500 truncate">My Registrations</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.myRegistrations}</dd>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Events Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Events Over Time</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.monthlyEventsData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 text-sm text-gray-500">{item.month}</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.max((item.count / Math.max(...stats.monthlyEventsData.map(d => d.count))) * 100, 5)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-8 text-sm font-medium text-gray-900">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Events by Category</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(stats.categoryBreakdown).map(([category, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index % 5]
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                    </div>
                    <span className="text-sm text-gray-500">{count} events</span>
                  </div>
                ))}
                {Object.keys(stats.categoryBreakdown).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No events available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Most Popular Events</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.popularEvents.map((event, index) => (
                <div key={event.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{formatDate(event.date)}</p>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span className="text-sm text-gray-500">{event.registrationCount || 0} registered</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {stats.popularEvents.length === 0 && (
                <div className="p-6 text-center text-gray-500">No events available</div>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentEvents.map((event) => (
                <div key={event.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{formatDate(event.date)}</p>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {event.category}
                        </span>
                        <span className="text-sm text-gray-500">{event.location}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {event.creatorName?.split(' ').map(n => n[0]).join('') || 'U'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {stats.recentEvents.length === 0 && (
                <div className="p-6 text-center text-gray-500">No events available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}