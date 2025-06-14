import React, { useState, useEffect } from 'react';
import { Car, CarService, CreateCarDto } from '@/services/car.service';
import { Fillup, FillupService } from '@/services/fillup.service';
import { CarForm } from '@/components/CarForm';
import { FillupList } from '@/components/FillupList';
import { FillupForm } from '@/components/FillupForm';

export const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCarForm, setShowCarForm] = useState(false);
  const [showFillupForm, setShowFillupForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | undefined>();
  const [selectedFillup, setSelectedFillup] = useState<Fillup | undefined>();

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await CarService.getCars();
      setCars(data);
      setError('');
    } catch (err) {
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleCreateCar = async (carData: CreateCarDto) => {
    try {
      await CarService.createCar(carData);
      await loadCars();
      setShowCarForm(false);
    } catch (err) {
      setError('Failed to create car. Please try again.');
    }
  };

  const handleUpdateCar = async (carData: CreateCarDto) => {
    if (!selectedCar) return;
    try {
      await CarService.updateCar(selectedCar.id, carData);
      await loadCars();
      setShowCarForm(false);
      setSelectedCar(undefined);
    } catch (err) {
      setError('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (car: Car) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      await CarService.deleteCar(car.id);
      await loadCars();
      if (selectedCar?.id === car.id) {
        setSelectedCar(undefined);
      }
    } catch (err) {
      setError('Failed to delete car. Please try again.');
    }
  };

  const handleCancelCarForm = () => {
    setShowCarForm(false);
    setSelectedCar(undefined);
  };

  const handleAddFillup = () => {
    setSelectedFillup(undefined);
    setShowFillupForm(true);
    setShowCarForm(false);
  };

  const handleEditFillup = (fillup: Fillup) => {
    setSelectedFillup(fillup);
    setShowFillupForm(true);
    setShowCarForm(false);
  };

  const handleDeleteFillup = async (fillup: Fillup) => {
    try {
      await FillupService.deleteFillup(fillup.id);
    } catch (err) {
      setError('Failed to delete fillup. Please try again.');
    }
  };

  const handleFillupFormSuccess = () => {
    setShowFillupForm(false);
    setSelectedFillup(undefined);
  };

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    setShowCarForm(false);
    setShowFillupForm(false);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div 
          data-testid="loading-spinner"
          className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col lg:flex-row">
      {/* Left Sidebar - Car List */}
      <div className="w-full lg:w-1/3 lg:min-w-[300px] border-b lg:border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">My Cars</h2>
            <button
              onClick={() => {
                setSelectedCar(undefined);
                setShowCarForm(true);
              }}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Car
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {cars.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No cars found. Add your first car!
            </div>
          ) : (
            cars.map(car => (
              <div
                key={car.id}
                onClick={() => handleSelectCar(car)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCar?.id === car.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {car.name || `${car.year} ${car.make} ${car.model}`}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {car.make} {car.model} • {car.year}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content - Car Details/Form */}
      <div className="flex-1 bg-white overflow-y-auto p-4 sm:p-6">
        {showCarForm ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCar ? 'Edit Car' : 'Add New Car'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {selectedCar ? 'Update the details of your car.' : 'Add a new car to your collection.'}
              </p>
            </div>
            <CarForm
              car={selectedCar}
              onSubmit={selectedCar ? handleUpdateCar : handleCreateCar}
              onCancel={handleCancelCarForm}
            />
          </>
        ) : selectedCar ? (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCar.name || `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedCar.make} {selectedCar.model} • {selectedCar.year}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <button
                  onClick={() => setShowCarForm(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCar(selectedCar)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Make</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">{selectedCar.make}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Model</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">{selectedCar.model}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Year</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">{selectedCar.year}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Initial Mileage</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">{selectedCar.initial_mileage.toLocaleString()} miles</dd>
                </div>
                {selectedCar.vin && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">VIN</dt>
                    <dd className="mt-1 text-base font-medium text-gray-900 font-mono break-all">{selectedCar.vin}</dd>
                  </div>
                )}
                {selectedCar.name && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Nickname</dt>
                    <dd className="mt-1 text-base font-medium text-gray-900">{selectedCar.name}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Fillup History</h3>
                <button
                  onClick={handleAddFillup}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Fillup
                </button>
              </div>

              {showFillupForm ? (
                <FillupForm
                  carId={selectedCar.id}
                  fillup={selectedFillup}
                  onSuccess={handleFillupFormSuccess}
                  onCancel={() => {
                    setShowFillupForm(false);
                    setSelectedFillup(undefined);
                  }}
                />
              ) : (
                <FillupList
                  carId={selectedCar.id}
                  onEdit={handleEditFillup}
                  onDelete={handleDeleteFillup}
                />
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <p>Select a car from the list or add a new one to get started.</p>
          </div>
        )}
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 p-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 