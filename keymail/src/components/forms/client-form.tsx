"use client";

import { useState, useEffect } from "react";
import { ClientFormData } from "@/types";

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ClientForm({ initialData, onSubmit, isSubmitting }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    closingAnniversary: "",
    yearsKnown: undefined,
    relationshipLevel: "new",
    tags: [],
    customFields: {},
    preferences: {
      communicationFrequency: "monthly",
      preferredContactMethod: "email",
    },
    ...initialData,
  });

  // For handling tags input
  const [tagInput, setTagInput] = useState("");

  // Format dates for date inputs
  useEffect(() => {
    // Format birthday if it exists
    if (formData.birthday && typeof formData.birthday === "string" && !formData.birthday.includes("T")) {
      const date = new Date(formData.birthday);
      if (!isNaN(date.getTime())) {
        setFormData((prev) => ({
          ...prev,
          birthday: date.toISOString().split("T")[0],
        }));
      }
    }

    // Format closing anniversary if it exists
    if (formData.closingAnniversary && typeof formData.closingAnniversary === "string" && !formData.closingAnniversary.includes("T")) {
      const date = new Date(formData.closingAnniversary);
      if (!isNaN(date.getTime())) {
        setFormData((prev) => ({
          ...prev,
          closingAnniversary: date.toISOString().split("T")[0],
        }));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ClientFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.phone || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
              Birthday
            </label>
            <input
              id="birthday"
              name="birthday"
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.birthday || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="closingAnniversary" className="block text-sm font-medium text-gray-700">
              Closing Anniversary
            </label>
            <input
              id="closingAnniversary"
              name="closingAnniversary"
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.closingAnniversary || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="yearsKnown" className="block text-sm font-medium text-gray-700">
              Years Known
            </label>
            <input
              id="yearsKnown"
              name="yearsKnown"
              type="number"
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.yearsKnown || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="relationshipLevel" className="block text-sm font-medium text-gray-700">
              Relationship Level
            </label>
            <select
              id="relationshipLevel"
              name="relationshipLevel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.relationshipLevel || "new"}
              onChange={handleInputChange}
            >
              <option value="new">New</option>
              <option value="established">Established</option>
              <option value="close">Close</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex mt-1">
              <input
                id="tagInput"
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag"
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-200"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag) => (
                <div key={tag} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="preferences.communicationFrequency" className="block text-sm font-medium text-gray-700">
              Communication Frequency
            </label>
            <select
              id="preferences.communicationFrequency"
              name="preferences.communicationFrequency"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.preferences?.communicationFrequency || "monthly"}
              onChange={handleInputChange}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label htmlFor="preferences.preferredContactMethod" className="block text-sm font-medium text-gray-700">
              Preferred Contact Method
            </label>
            <select
              id="preferences.preferredContactMethod"
              name="preferences.preferredContactMethod"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.preferences?.preferredContactMethod || "email"}
              onChange={handleInputChange}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="text">Text</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Client"}
        </button>
      </div>
    </form>
  );
} 