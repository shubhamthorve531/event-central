import { useState, useEffect } from 'react';
import { EventRegistrationService } from '../services/EventRegistrationService';
import type { Event } from '../types/Event';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onRegistrationChange?: (eventId: number, isRegistered: boolean) => void;
}

export function EventCard({ event, showActions = true, onRegistrationChange }: EventCardProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && event.id) {
      checkRegistrationStatus();
      getRegistrationCount();
    }
  }, [event.id, isAuthenticated]);

  const checkRegistrationStatus = async () => {
    try {
      const result = await EventRegistrationService.isRegistered(event.id!);
      setIsRegistered(result.isRegistered);
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  const getRegistrationCount = async () => {
    try {
      const result = await EventRegistrationService.getRegistrationCount(event.id!);
      setRegistrationCount(result.count);
    } catch (error) {
      console.error('Error getting registration count:', error);
    }
  };

  const handleRegistration = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistered) {
        const result = await EventRegistrationService.unregisterFromEvent(event.id!);
        setIsRegistered(false);
        setRegistrationCount(prev => prev - 1);
        toast.success(result.message || 'Successfully unregistered from event');
        onRegistrationChange?.(event.id!, false);
      } else {
        const result = await EventRegistrationService.registerForEvent(event.id!);
        setIsRegistered(true);
        setRegistrationCount(prev => prev + 1);
        toast.success(result.message || 'Successfully registered for event');
        onRegistrationChange?.(event.id!, true);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventPast = () => {
    return new Date(event.date) < new Date();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Event Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9H4V7z" clipRule="evenodd"/>
              </svg>
              {formatDate(event.date)}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              {event.location}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            isEventPast() ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
          }`}>
            {isEventPast() ? 'Past Event' : 'Upcoming'}
          </span>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {event.category}
          </span>
        </div>
      </div>

      {/* Event Description - Allow this to grow and take available space */}
      <div className="flex-1">
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        {/* Creator Info */}
        {event.creatorName && (
          <div className="flex items-center mb-4 text-sm text-gray-500">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-semibold text-xs">
                {event.creatorName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span>Organized by {event.creatorName}</span>
          </div>
        )}
      </div>

      {/* Registration Info & Actions - Always at bottom */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 11-4 0 2 2 0 014 0zM12 8a2 2 0 11-4 0 2 2 0 014 0zM2 12a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 11-4 0 2 2 0 014 0zM5 16a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {registrationCount} registered
            </div>
            {isRegistered && (
              <div className="flex items-center text-green-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                You're registered
              </div>
            )}
          </div>

          {isAuthenticated && !isEventPast() && (
            <button
              onClick={handleRegistration}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRegistered
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isRegistered ? 'Unregistering...' : 'Registering...'}
                </div>
              ) : (
                <>
                  {isRegistered ? (
                    <>
                      <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      Unregister
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                      </svg>
                      Register
                    </>
                  )}
                </>
              )}
            </button>
          )}

          {!isAuthenticated && !isEventPast() && (
            <button
              onClick={() => toast.error('Please login to register for events')}
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm font-medium cursor-not-allowed"
            >
              Login to Register
            </button>
          )}

          {isEventPast() && (
            <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-md text-sm font-medium">
              Event Ended
            </span>
          )}
        </div>
      )}
    </div>
  );
}